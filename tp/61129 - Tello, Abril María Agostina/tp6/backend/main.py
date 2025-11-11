
from fastapi import FastAPI, Depends, HTTPException, status, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from database import crear_db, get_session
from models import Usuario, Producto, Carrito, CarritoItem, Compra, CompraItem
from typing import List, Optional
from datetime import datetime
import jwt
import hashlib
import json
from pathlib import Path

app = FastAPI(title="API Productos")
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

@app.get("/usuarios")
def listar_usuarios(session: Session = Depends(get_session)):
    usuarios = session.exec(select(Usuario)).all()
    return usuarios

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "supersecret"
ALGORITHM = "HS256"

# Utilidades
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_jwt(user_id: int) -> str:
    return jwt.encode({"user_id": user_id}, SECRET_KEY, algorithm=ALGORITHM)

def decode_jwt(token: str) -> Optional[int]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("user_id")
    except Exception:
        return None

def get_current_user(token: str = ""):
    user_id = decode_jwt(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="No autenticado")
    return user_id

@app.on_event("startup")
def startup():
    crear_db()
    # Seed de productos si la tabla está vacía
    from sqlmodel import Session
    ruta_json = Path(__file__).parent / "productos.json"
    with Session(get_session.__globals__["engine"]) as session:
        if not session.exec(select(Producto)).first():
            if ruta_json.exists():
                with open(ruta_json, "r", encoding="utf-8") as f:
                    productos = json.load(f)
                    for prod in productos:
                        p = Producto(**prod)
                        session.add(p)
                    session.commit()

# ENDPOINTS

@app.post("/registrar")
async def registrar(request: Request, session: Session = Depends(get_session)):
    # Permitir tanto form-data como JSON
    if request.headers.get("content-type", "").startswith("application/json"):
        data = await request.json()
        nombre = data.get("nombre")
        email = data.get("email")
        password = data.get("password")
    else:
        form = await request.form()
        nombre = form.get("nombre")
        email = form.get("email")
        password = form.get("password")
    print(f"[REGISTRO] Recibido: nombre={nombre}, email={email}")
    if session.exec(select(Usuario).where(Usuario.email == email)).first():
        print("[REGISTRO] Email ya registrado")
        raise HTTPException(status_code=400, detail="Email ya registrado")
    usuario = Usuario(nombre=nombre, email=email, password=hash_password(password))
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    print(f"[REGISTRO] Usuario creado: {usuario}")
    return {"id": usuario.id, "email": usuario.email}

@app.post("/iniciar-sesion")
async def iniciar_sesion(request: Request, session: Session = Depends(get_session)):
    # Permitir tanto form-data como JSON
    if request.headers.get("content-type", "").startswith("application/json"):
        data = await request.json()
        email = data.get("email")
        password = data.get("password")
    else:
        form = await request.form()
        email = form.get("email")
        password = form.get("password")
    print(f"[LOGIN] Email recibido: {email}")
    usuario = session.exec(select(Usuario).where(Usuario.email == email)).first()
    print(f"[LOGIN] Usuario encontrado: {usuario}")
    if not usuario:
        print("[LOGIN] Usuario no registrado")
        raise HTTPException(status_code=404, detail="No se encontró ningún usuario registrado con ese email")
    if not verify_password(password, usuario.password):
        print("[LOGIN] Contraseña incorrecta")
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    token = create_jwt(usuario.id)
    print("[LOGIN] Login exitoso")
    return {"access_token": token, "token_type": "bearer", "nombre": usuario.nombre, "email": usuario.email}

@app.get("/productos")
def listar_productos(buscar: Optional[str] = None, categoria: Optional[str] = None, session: Session = Depends(get_session)):
    query = select(Producto)
    if buscar:
        query = query.where((Producto.nombre.contains(buscar)) | (Producto.descripcion.contains(buscar)))
    if categoria:
        query = query.where(Producto.categoria == categoria)
    productos = session.exec(query).all()
    return productos

@app.get("/productos/{id}")
def detalle_producto(id: int, session: Session = Depends(get_session)):
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

# Carrito
@app.get("/carrito")
def obtener_carrito(token: str, session: Session = Depends(get_session)):
    user_id = get_current_user(token)
    carrito = session.exec(select(Carrito).where((Carrito.usuario_id == user_id) & (Carrito.estado == "activo"))).first()
    if not carrito:
        carrito = Carrito(usuario_id=user_id, estado="activo")
        session.add(carrito)
        session.commit()
        session.refresh(carrito)
    items = session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito.id)).all()
    return {"carrito_id": carrito.id, "items": items}

@app.post("/carrito")
def agregar_item_carrito(token: str, producto_id: int, cantidad: int, session: Session = Depends(get_session)):
    user_id = get_current_user(token)
    producto = session.get(Producto, producto_id)
    if not producto or producto.existencia < cantidad:
        raise HTTPException(status_code=400, detail="Stock insuficiente")
    carrito = session.exec(select(Carrito).where((Carrito.usuario_id == user_id) & (Carrito.estado == "activo"))).first()
    if not carrito:
        carrito = Carrito(usuario_id=user_id, estado="activo")
        session.add(carrito)
        session.commit()
        session.refresh(carrito)
    item = session.exec(select(CarritoItem).where((CarritoItem.carrito_id == carrito.id) & (CarritoItem.producto_id == producto_id))).first()
    if item:
        item.cantidad += cantidad
    else:
        item = CarritoItem(carrito_id=carrito.id, producto_id=producto_id, cantidad=cantidad)
        session.add(item)
    session.commit()
    return {"ok": True}

@app.delete("/carrito/{producto_id}")
def quitar_item_carrito(token: str, producto_id: int, session: Session = Depends(get_session)):
    user_id = get_current_user(token)
    carrito = session.exec(select(Carrito).where((Carrito.usuario_id == user_id) & (Carrito.estado == "activo"))).first()
    item = session.exec(select(CarritoItem).where((CarritoItem.carrito_id == carrito.id) & (CarritoItem.producto_id == producto_id))).first()
    if item:
        session.delete(item)
        session.commit()
    return {"ok": True}

@app.post("/carrito/finalizar")
def finalizar_compra(token: str, direccion: str, tarjeta: str, session: Session = Depends(get_session)):
    user_id = get_current_user(token)
    carrito = session.exec(select(Carrito).where((Carrito.usuario_id == user_id) & (Carrito.estado == "activo"))).first()
    items = session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito.id)).all()
    if not items:
        raise HTTPException(status_code=400, detail="Carrito vacío")
    subtotal = sum([session.get(Producto, i.producto_id).precio * i.cantidad for i in items])
    total_iva = 0
    for i in items:
        prod = session.get(Producto, i.producto_id)
        iva = 0.1 if prod.categoria.lower() == "electronica" else 0.21
        total_iva += prod.precio * iva * i.cantidad
    costo_envio = 0 if subtotal > 1000 else 50
    total_final = subtotal + total_iva + costo_envio
    compra = Compra(
        usuario_id=user_id,
        fecha=datetime.now(),
        direccion_envio=direccion,
        metodo_pago=tarjeta[-4:],
        total_productos=subtotal,
        total_iva=total_iva,
        costo_envio=costo_envio,
        total_final=total_final
    )
    session.add(compra)
    session.commit()
    session.refresh(compra)
    for i in items:
        prod = session.get(Producto, i.producto_id)
        compra_item = CompraItem(
            compra_id=compra.id,
            producto_id=prod.id,
            nombre_producto_snapshot=prod.nombre,
            precio_unitario_snapshot=prod.precio,
            cantidad=i.cantidad
        )
        prod.existencia -= i.cantidad
        session.add(compra_item)
    carrito.estado = "finalizado"
    session.commit()
    return {"compra_id": compra.id}

@app.post("/carrito/cancelar")
def cancelar_carrito(token: str, session: Session = Depends(get_session)):
    user_id = get_current_user(token)
    carrito = session.exec(select(Carrito).where((Carrito.usuario_id == user_id) & (Carrito.estado == "activo"))).first()
    if carrito:
        items = session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito.id)).all()
        for item in items:
            session.delete(item)
        session.commit()
    return {"ok": True}

@app.get("/compras")
def historial_compras(token: str, session: Session = Depends(get_session)):
    user_id = get_current_user(token)
    compras = session.exec(select(Compra).where(Compra.usuario_id == user_id)).all()
    return compras

@app.get("/compras/{id}")
def detalle_compra(token: str, id: int, session: Session = Depends(get_session)):
    user_id = get_current_user(token)
    compra = session.get(Compra, id)
    if not compra or compra.usuario_id != user_id:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    items = session.exec(select(CompraItem).where(CompraItem.compra_id == compra.id)).all()
    return {"compra": compra, "items": items}

@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}
