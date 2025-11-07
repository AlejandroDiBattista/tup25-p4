from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, Field, Session, create_engine, select
from typing import Optional
from pydantic import BaseModel
from pathlib import Path
import hashlib, secrets, json
import time
from sqlalchemy import text  # <-- agregar

# ------------------ DB / ENGINE ------------------
BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "ParcialProgramacion.db"
engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False}, echo=False)

def get_session():
    with Session(engine) as s:
        yield s

# ------------------ MODELOS ------------------
class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    email: str
    password_hash: str

# IMPORTANTE: la columna real en la DB es 'nombre'; vamos a guardar ahí el título.
class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str                                      # aquí guardamos el "titulo" del JSON
    descripcion: Optional[str] = ""
    precio: float = 0
    categoria: Optional[str] = ""
    valoracion: Optional[float] = None
    existencia: int = 0
    imagen: Optional[str] = None

class Carrito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    estado: str = "abierto"

class CarritoItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    carrito_id: int = Field(foreign_key="carrito.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int = 1

# ------------------ APP / CORS / STATIC ------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # DEBUG: permitir todos (luego volver a restringir)
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)
app.mount("/imagenes", StaticFiles(directory=str(BASE_DIR / "imagenes"), check_dir=False), name="imagenes")

# Log simple de requests
@app.middleware("http")
async def log_requests(request, call_next):
    t0 = time.time()
    try:
        resp = await call_next(request)
        return resp
    finally:
        dt = (time.time() - t0) * 1000
        print(f"[{request.method}] {request.url.path} -> {dt:.1f}ms")

def _img_url(img: str | None) -> str | None:
    if not img: return None
    if img.startswith(("http://", "https://", "//")): return img
    if img.startswith("/imagenes/"): return img
    if img.startswith("imagenes/"): return f"/{img}"
    return f"/imagenes/{img}"

# ------------------ CARGA / REPARACIÓN DE PRODUCTOS ------------------
def _ensure_schema():
    # crea columnas faltantes y sincroniza nombre desde titulo
    with engine.begin() as conn:
        cols = {row[1] for row in conn.execute(text("PRAGMA table_info('producto')")).fetchall()}

        def ensure_col(name: str, type_sql: str, default_sql: str | None = None):
            nonlocal cols
            if name not in cols:
                conn.execute(text(f"ALTER TABLE producto ADD COLUMN {name} {type_sql}"))
                if default_sql is not None:
                    conn.execute(text(f"UPDATE producto SET {name} = {default_sql} WHERE {name} IS NULL"))
                cols.add(name)

        # asegurar columnas que usamos en el modelo
        ensure_col("nombre", "TEXT")
        ensure_col("descripcion", "TEXT", "''")
        ensure_col("precio", "REAL", "0")
        ensure_col("categoria", "TEXT", "''")
        ensure_col("valoracion", "REAL")
        ensure_col("existencia", "INTEGER", "0")
        ensure_col("imagen", "TEXT")

        # copiar titulo -> nombre cuando esté vacío (si existe columna titulo)
        if "titulo" in cols:
            conn.execute(text("""
                UPDATE producto
                SET nombre = COALESCE(NULLIF(nombre, ''), NULLIF(titulo, ''))
                WHERE (nombre IS NULL OR nombre = '') AND titulo IS NOT NULL AND titulo <> ''
            """))
        # fallback "Producto {id}" si sigue vacío
        conn.execute(text("""
            UPDATE producto
            SET nombre = 'Producto ' || id
            WHERE nombre IS NULL OR nombre = ''
        """))

def cargar_productos_json(s: Session):
    ruta = BASE_DIR / "productos.json"
    if not ruta.exists():
        return
    # Si ya hay productos, no recargar
    if s.exec(select(Producto.id)).first():
        return
    data = json.loads(ruta.read_text(encoding="utf-8"))
    for it in data:
        p = Producto(
            id=it.get("id"),
            nombre=(it.get("titulo") or "").strip(),    # guardamos titulo en 'nombre'
            descripcion=it.get("descripcion") or "",
            precio=float(it.get("precio") or 0),
            categoria=it.get("categoria") or "",
            valoracion=it.get("valoracion"),
            existencia=int(it.get("existencia") or 0),
            imagen=it.get("imagen"),
        )
        s.add(p)
    s.commit()

def reparar_nombres_desde_json(s: Session):
    ruta = BASE_DIR / "productos.json"
    if not ruta.exists():
        return
    data = json.loads(ruta.read_text(encoding="utf-8"))
    by_id = {int(item["id"]): item for item in data if "id" in item}
    prods = s.exec(select(Producto)).all()
    changed = 0
    for p in prods:
        src = by_id.get(int(p.id)) if p.id is not None else None
        if not src:
            continue
        # NUNCA usar descripcion como nombre: solo 'titulo' del JSON
        new_nombre = (src.get("titulo") or "").strip()
        if new_nombre and new_nombre != (p.nombre or ""):
            p.nombre = new_nombre
            changed += 1
        # Sincronizamos los demás campos para mantener consistencia
        if (p.descripcion or "") != (src.get("descripcion") or ""):
            p.descripcion = src.get("descripcion") or ""
            changed += 1
        precio_src = float(src.get("precio") or 0)
        if float(p.precio or 0) != precio_src:
            p.precio = precio_src
            changed += 1
        if (p.categoria or "") != (src.get("categoria") or ""):
            p.categoria = src.get("categoria") or ""
            changed += 1
        if p.valoracion != src.get("valoracion"):
            p.valoracion = src.get("valoracion")
            changed += 1
        existencia_src = int(src.get("existencia") or 0)
        if int(p.existencia or 0) != existencia_src:
            p.existencia = existencia_src
            changed += 1
        if (p.imagen or "") != (src.get("imagen") or ""):
            p.imagen = src.get("imagen")
            changed += 1
        s.add(p)
    if changed:
        s.commit()

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)
    _ensure_schema()                 # <-- nuevo: migración segura
    with Session(engine) as s:
        cargar_productos_json(s)     # carga inicial si la tabla está vacía
        reparar_nombres_desde_json(s)# corrige nombres desde productos.json

# ------------------ AUTH ------------------
def hash_password(p: str) -> str:
    return hashlib.sha256(p.encode()).hexdigest()

def verify_password(p: str, h: str) -> bool:
    return hash_password(p) == h

active_tokens: dict[str, int] = {}

def current_user_id(authorization: str | None = Header(None)) -> int:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="No autorizado")
    token = authorization.split(" ", 1)[1]
    uid = active_tokens.get(token)
    if not uid:
        raise HTTPException(status_code=401, detail="Token inválido")
    return uid

class RegisterRequest(BaseModel):
    nombre: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class CartAdd(BaseModel):
    producto_id: int
    cantidad: int = 1

@app.post("/registrar", status_code=201)
def registrar(req: RegisterRequest, s: Session = Depends(get_session)):
    if s.exec(select(Usuario).where(Usuario.email == req.email)).first():
        raise HTTPException(status_code=400, detail="Email ya registrado")
    u = Usuario(nombre=req.nombre, email=req.email, password_hash=hash_password(req.password))
    s.add(u); s.commit(); s.refresh(u)
    return {"id": u.id, "email": u.email}

@app.post("/iniciar-sesion")
def login(req: LoginRequest, s: Session = Depends(get_session)):
    u = s.exec(select(Usuario).where(Usuario.email == req.email)).first()
    if not u or not verify_password(req.password, u.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = secrets.token_hex(16)
    active_tokens[token] = u.id
    return {"access_token": token, "token_type": "bearer", "user": {"id": u.id, "nombre": u.nombre}}

def _leer_productos_json() -> list[dict]:
    ruta = BASE_DIR / "productos.json"
    if not ruta.exists():
        return []
    try:
        return json.loads(ruta.read_text(encoding="utf-8"))
    except Exception as e:
        print("ERROR leyendo productos.json:", e)
        return []

# ------------------ PRODUCTOS ------------------
@app.get("/productos")
def listar_productos(buscar: Optional[str] = None, categoria: Optional[str] = None, s: Session = Depends(get_session)):
    print("DEBUG: /productos")
    try:
        prods = s.exec(select(Producto)).all()
    except Exception as e:
        print("ERROR DB /productos:", e)
        prods = []

    # Fallback si la BD no responde o está vacía
    if not prods:
        data = _leer_productos_json()
        if buscar:
            b = (buscar or "").lower()
            data = [d for d in data if b in (d.get("titulo","").lower() or "") or b in (d.get("descripcion","").lower() or "")]
        if categoria:
            c = (categoria or "").lower()
            data = [d for d in data if c in (d.get("categoria","").lower() or "")]
        return [{
            "id": d.get("id"),
            "titulo": d.get("titulo"),
            "precio": d.get("precio"),
            "descripcion": d.get("descripcion") or "",
            "categoria": d.get("categoria") or "",
            "valoracion": d.get("valoracion"),
            "existencia": int(d.get("existencia") or 0),
            "imagen": d.get("imagen"),
            "imagen_url": _img_url(d.get("imagen")),
            "agotado": int(d.get("existencia") or 0) <= 0
        } for d in data]

    # Respuesta normal desde BD
    if buscar:
        b = buscar.lower()
        prods = [p for p in prods if b in (p.nombre or "").lower() or b in (p.descripcion or "").lower()]
    if categoria:
        c = categoria.lower()
        prods = [p for p in prods if c in (p.categoria or "").lower()]
    return [{
        "id": p.id,
        "titulo": p.nombre,
        "precio": p.precio,
        "descripcion": p.descripcion,
        "categoria": p.categoria,
        "valoracion": p.valoracion,
        "existencia": p.existencia,
        "imagen": p.imagen,
        "imagen_url": _img_url(p.imagen),
        "agotado": p.existencia <= 0
    } for p in prods]

@app.get("/productos/{producto_id}")
def detalle_producto(producto_id: int, s: Session = Depends(get_session)):
    p = s.get(Producto, producto_id)
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {
        "id": p.id,
        "titulo": p.nombre,                # <- idem
        "precio": p.precio,
        "descripcion": p.descripcion,
        "categoria": p.categoria,
        "valoracion": p.valoracion,
        "existencia": p.existencia,
        "imagen": p.imagen,
        "imagen_url": _img_url(p.imagen),
        "agotado": p.existencia <= 0,
    }

# ------------------ CARRITO ------------------
def get_or_create_cart(s: Session, uid: int) -> Carrito:
    c = s.exec(select(Carrito).where(Carrito.usuario_id == uid, Carrito.estado == "abierto")).first()
    if c: return c
    c = Carrito(usuario_id=uid, estado="abierto")
    s.add(c); s.commit(); s.refresh(c)
    return c

@app.get("/carrito")
def carrito(uid: int = Depends(current_user_id), s: Session = Depends(get_session)):
    c = get_or_create_cart(s, uid)
    items = s.exec(select(CarritoItem).where(CarritoItem.carrito_id == c.id)).all()
    data = []
    for it in items:
        p = s.get(Producto, it.producto_id)
        if not p: continue
        data.append({
            "producto_id": p.id,
            "titulo": p.nombre,            # <- titulo en carrito
            "cantidad": it.cantidad,
            "precio": p.precio,
            "imagen": p.imagen,
            "imagen_url": _img_url(p.imagen),
        })
    return {"carrito_id": c.id, "items": data}

@app.post("/carrito")
def carrito_agregar(body: CartAdd, uid: int = Depends(current_user_id), s: Session = Depends(get_session)):
    p = s.get(Producto, body.producto_id)
    if not p: raise HTTPException(404, "Producto no encontrado")
    if p.existencia <= 0: raise HTTPException(400, "Producto agotado")
    c = get_or_create_cart(s, uid)
    it = s.exec(select(CarritoItem).where(CarritoItem.carrito_id == c.id, CarritoItem.producto_id == p.id)).first()
    if it:
        if it.cantidad + body.cantidad > p.existencia:
            raise HTTPException(400, "Stock insuficiente")
        it.cantidad += body.cantidad
    else:
        if body.cantidad > p.existencia:
            raise HTTPException(400, "Stock insuficiente")
        s.add(CarritoItem(carrito_id=c.id, producto_id=p.id, cantidad=body.cantidad))
    s.commit()
    return {"ok": True}

@app.post("/carrito/restar")
def carrito_restar(body: CartAdd, uid: int = Depends(current_user_id), s: Session = Depends(get_session)):
    c = get_or_create_cart(s, uid)
    it = s.exec(select(CarritoItem).where(CarritoItem.carrito_id == c.id, CarritoItem.producto_id == body.producto_id)).first()
    if not it: raise HTTPException(status_code=404, detail="No está en el carrito")
    it.cantidad -= max(1, int(body.cantidad or 1))
    if it.cantidad <= 0: s.delete(it)
    s.commit()
    return {"ok": True}

@app.post("/carrito/cancelar")
def carrito_cancelar(uid: int = Depends(current_user_id), s: Session = Depends(get_session)):
    c = s.exec(select(Carrito).where(Carrito.usuario_id == uid, Carrito.estado == "abierto")).first()
    if not c: return {"ok": True}
    items = s.exec(select(CarritoItem).where(CarritoItem.carrito_id == c.id)).all()
    for it in items: s.delete(it)
    s.commit()
    return {"ok": True}

@app.delete("/carrito/{product_id}")
def carrito_quitar(product_id: int, uid: int = Depends(current_user_id), s: Session = Depends(get_session)):
    c = get_or_create_cart(s, uid)
    it = s.exec(select(CarritoItem).where(CarritoItem.carrito_id == c.id, CarritoItem.producto_id == product_id)).first()
    if not it:
        raise HTTPException(status_code=404, detail="No está en el carrito")
    s.delete(it)
    s.commit()
    return {"ok": True}

# ------------------ HEALTH ------------------
@app.get("/health")
def health():
    return {"ok": True}

