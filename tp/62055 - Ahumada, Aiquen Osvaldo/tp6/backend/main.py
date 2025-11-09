
# --- IMPORTS Y APP ---
from fastapi import FastAPI, Path, Body, Depends, HTTPException, status, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import pathlib
import json
from typing import Optional
from passlib.hash import argon2
from uuid import uuid4
from sqlmodel import select, Session
from database import engine, create_db_and_tables
from models.productos import Producto
from models.usuarios import Usuario, UsuarioCreate, SessionToken

app = FastAPI(title="API E-Commerce (TP6)")

carritos = {}

app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Dependencias y utilidades para autenticación ---
def get_db_session():
    with Session(engine) as session:
        yield session

def get_user_by_email(session: Session, email: str) -> Optional[Usuario]:
    statement = select(Usuario).where(Usuario.email == email)
    result = session.exec(statement).first()
    return result

def get_user_by_token(session: Session, token: str) -> Optional[Usuario]:
    if not token:
        return None
    statement = select(SessionToken).where(SessionToken.token == token)
    ses = session.exec(statement).first()
    if not ses:
        return None
    statement_u = select(Usuario).where(Usuario.id == ses.user_id)
    user = session.exec(statement_u).first()
    return user

# Dependencia para obtener usuario actual desde header Authorization: Bearer <token>
def get_current_user(authorization: Optional[str] = Header(None), session: Session = Depends(get_db_session)) -> Usuario:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Falta header Authorization")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Formato de Authorization inválido")
    token = parts[1]
    user = get_user_by_token(session, token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado")
    return user

# ----------------------------
# Endpoints de Carrito
# ----------------------------
@app.post("/carrito")
def agregar_al_carrito(data: dict = Body(...), user: Usuario = Depends(get_current_user)):
    producto_id = data.get("producto_id")
    cantidad = data.get("cantidad", 1)
    if not producto_id:
        raise HTTPException(status_code=400, detail="Falta producto_id")
    ruta_productos = pathlib.Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        productos = json.load(archivo)
    producto = next((p for p in productos if p["id"] == producto_id), None)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    if producto["existencia"] < cantidad:
        raise HTTPException(status_code=400, detail="No hay stock disponible para este producto")
    # Descontar stock
    for p in productos:
        if p["id"] == producto_id:
            p["existencia"] -= cantidad
    with open(ruta_productos, "w", encoding="utf-8") as archivo:
        json.dump(productos, archivo, ensure_ascii=False, indent=4)
    carrito = carritos.get(user.id, {})
    carrito[producto_id] = carrito.get(producto_id, 0) + cantidad
    carritos[user.id] = carrito
    return {"mensaje": "Producto agregado al carrito", "carrito": carrito}

@app.get("/carrito")
def ver_carrito(user: Usuario = Depends(get_current_user)):
    carrito = carritos.get(user.id, {})
    ruta_productos = pathlib.Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        productos = json.load(archivo)
    items = []
    subtotal = 0
    iva = 0
    for pid, cantidad in carrito.items():
        prod = next((p for p in productos if p["id"] == pid), None)
        if prod:
            precio = prod["precio"]
            categoria = prod.get("categoria", "")
            items.append({
                "id": pid,
                "titulo": prod["titulo"],
                "precio_unitario": precio,
                "cantidad": cantidad,
                "subtotal": round(precio * cantidad, 2)
            })
            subtotal += precio * cantidad
            if "Electrónica" in categoria:
                iva += precio * cantidad * 0.10
            else:
                iva += precio * cantidad * 0.21
    envio = 0 if subtotal > 1000 else 50
    total = subtotal + iva + envio
    resumen = {
        "subtotal": round(subtotal, 2),
        "iva": round(iva, 2),
        "envio": round(envio, 2),
        "total": round(total, 2)
    }
    return {"carrito": items, "resumen": resumen}

@app.delete("/carrito/{producto_id}")
@app.delete("/carrito/{producto_id}")
def quitar_del_carrito(producto_id: int = Path(..., description="ID del producto"), user: Usuario = Depends(get_current_user)):
    carrito = carritos.get(user.id, {})
    if producto_id in carrito:
        del carrito[producto_id]
        carritos[user.id] = carrito
        return {"mensaje": "Producto quitado del carrito", "carrito": carrito}
    raise HTTPException(status_code=404, detail="Producto no está en el carrito")

@app.post("/carrito/finalizar")
def finalizar_compra(user: Usuario = Depends(get_current_user)):
    carrito = carritos.get(user.id, {})
    if not carrito:
        raise HTTPException(status_code=400, detail="El carrito está vacío")
    # Aquí deberías crear la compra y vaciar el carrito
    carritos[user.id] = {}
    return {"mensaje": "Compra finalizada", "carrito": {}}

@app.post("/carrito/cancelar")
def cancelar_compra(user: Usuario = Depends(get_current_user)):
    carritos[user.id] = {}
    return {"mensaje": "Carrito cancelado", "carrito": {}}

@app.post("/carrito/finalizar")
def finalizar_compra(user: Usuario = Depends(get_current_user)):
    carrito = carritos.get(user.id, {})
    if not carrito:
        raise HTTPException(status_code=400, detail="El carrito está vacío")
    # Aquí deberías crear la compra y vaciar el carrito
    carritos[user.id] = {}
    return {"mensaje": "Compra finalizada", "carrito": {}}

@app.post("/carrito/cancelar")
def cancelar_compra(user: Usuario = Depends(get_current_user)):
    carritos[user.id] = {}
    return {"mensaje": "Carrito cancelado", "carrito": {}}
# ----------------------------
def cargar_productos():
    ruta_productos = pathlib.Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

@app.on_event("startup")
def on_startup():
    # Crea la DB y tablas si no existen
    create_db_and_tables()
    # Opcional: podés cargar productos a la DB desde productos.json aquí si querés persistirlos
    # Por ahora mantenemos productos.json como fuente única de productos (tal como tenías).
    pass

# ----------------------------
# Endpoints de Productos
# ----------------------------
from fastapi import Query

@app.get("/")
def root():
    return {"mensaje": "API E-Commerce TP6 - use /productos para obtener el listado"}

@app.get("/productos")
def obtener_productos(buscar: Optional[str] = Query(None), categoria: Optional[str] = Query(None)):
    productos = cargar_productos()
    if buscar:
        b = buscar.lower()
        productos = [p for p in productos if b in p.get("titulo", "").lower() or b in p.get("descripcion", "").lower()]
    if categoria:
        c = categoria.lower()
        productos = [p for p in productos if c in p.get("categoria", "").lower()]
    return productos

@app.get("/productos/{producto_id}")
def obtener_producto(producto_id: int):
    productos = cargar_productos()
    for p in productos:
        if p.get("id") == producto_id:
            return p
    raise HTTPException(status_code=404, detail="Producto no encontrado")



def get_db_session():
    with Session(engine) as session:
        yield session

def get_user_by_email(session: Session, email: str) -> Optional[Usuario]:
    statement = select(Usuario).where(Usuario.email == email)
    result = session.exec(statement).first()
    return result

def get_user_by_token(session: Session, token: str) -> Optional[Usuario]:
    if not token:
        return None
    statement = select(SessionToken).where(SessionToken.token == token)
    ses = session.exec(statement).first()
    if not ses:
        return None
    # buscar usuario
    statement_u = select(Usuario).where(Usuario.id == ses.user_id)
    user = session.exec(statement_u).first()
    return user

# Dependencia para obtener usuario actual desde header Authorization: Bearer <token>
def get_current_user(authorization: Optional[str] = Header(None), session: Session = Depends(get_db_session)) -> Usuario:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Falta header Authorization")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Formato de Authorization inválido")
    token = parts[1]
    user = get_user_by_token(session, token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado")
    return user


from fastapi import Body

@app.post("/registrar", status_code=201)
def registrar(usuario_in: UsuarioCreate = Body(...), session: Session = Depends(get_db_session)):
    existing = get_user_by_email(session, usuario_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    # Hash password
    # Usar argon2 para hashear la contraseña (sin límite de longitud)
    hashed = argon2.hash(usuario_in.password)
    nuevo = Usuario(nombre=usuario_in.nombre, email=usuario_in.email, hashed_password=hashed)
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return {"id": nuevo.id, "nombre": nuevo.nombre, "email": nuevo.email}


@app.post("/iniciar-sesion")
def iniciar_sesion(payload: dict = Body(...), session: Session = Depends(get_db_session)):
    """
    Espera { "email": "...", "password": "..." }
    Devuelve { "access_token": "<token>", "user": {id,nombre,email} }
    """
    email = payload.get("email")
    password = payload.get("password")
    if not email or not password:
        raise HTTPException(status_code=400, detail="email y password requeridos")
    user = get_user_by_email(session, email)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    # Verificar password con argon2
    if not argon2.verify(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    # Crear token de sesión
    token = str(uuid4())
    ses = SessionToken(token=token, user_id=user.id)
    session.add(ses)
    session.commit()
    session.refresh(ses)
    return {"access_token": token, "user": {"id": user.id, "nombre": user.nombre, "email": user.email}}


@app.post("/cerrar-sesion")
def cerrar_sesion(authorization: Optional[str] = Header(None), session: Session = Depends(get_db_session)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Falta Authorization header")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Formato de Authorization inválido")
    token = parts[1]
    statement = select(SessionToken).where(SessionToken.token == token)
    ses = session.exec(statement).first()
    if not ses:
        # ya invalidado
        return JSONResponse(status_code=200, content={"mensaje": "Sesión ya invalidada o token no encontrado"})
    session.delete(ses)
    session.commit()
    return {"mensaje": "Sesión cerrada correctamente"}
