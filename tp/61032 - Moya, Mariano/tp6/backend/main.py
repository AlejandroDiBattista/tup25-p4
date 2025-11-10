
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from models.db_models import Usuario, Carrito, CarritoItem, Producto
from fastapi import Header
from typing import Optional

app = FastAPI(title="API Productos")

# Utilidad para obtener usuario desde token
def get_usuario_id_from_token(token: Optional[str]) -> Optional[int]:
    if token and token.startswith("fake-token-"):
        try:
            return int(token.replace("fake-token-", ""))
        except:
            return None
    return None

# Montar directorio de imágenes como archivos estáticos
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint: Ver contenido del carrito
@app.get("/carrito")
def ver_carrito(Authorization: Optional[str] = Header(None)):
    usuario_id = get_usuario_id_from_token(Authorization.replace("Bearer ", "") if Authorization else None)
    if not usuario_id:
        raise HTTPException(status_code=401, detail="No autenticado")
    with Session(engine) as session:
        carrito = session.exec(select(Carrito).where(Carrito.usuario_id == usuario_id, Carrito.estado == "activo")).first()
        if not carrito:
            return {"productos": []}
        items = session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito.id)).all()
        productos = []
        for item in items:
            prod = session.get(Producto, item.producto_id)
            if prod:
                productos.append({"id": prod.id, "nombre": prod.nombre, "cantidad": item.cantidad, "precio": prod.precio})
        return {"productos": productos}

# Modelo para agregar producto al carrito
class CarritoAdd(BaseModel):
    producto_id: int
    cantidad: int

# Endpoint: Agregar producto al carrito
@app.post("/carrito")
def agregar_carrito(data: CarritoAdd, Authorization: Optional[str] = Header(None)):
    usuario_id = get_usuario_id_from_token(Authorization.replace("Bearer ", "") if Authorization else None)
    if not usuario_id:
        raise HTTPException(status_code=401, detail="No autenticado")
    with Session(engine) as session:
        producto = session.get(Producto, data.producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        if producto.existencia < data.cantidad:
            raise HTTPException(status_code=400, detail="No hay suficiente existencia")
        carrito = session.exec(select(Carrito).where(Carrito.usuario_id == usuario_id, Carrito.estado == "activo")).first()
        if not carrito:
            carrito = Carrito(usuario_id=usuario_id, estado="activo")
            session.add(carrito)
            session.commit()
            session.refresh(carrito)
        item = session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito.id, CarritoItem.producto_id == data.producto_id)).first()
        if item:
            item.cantidad += data.cantidad
        else:
            item = CarritoItem(carrito_id=carrito.id, producto_id=data.producto_id, cantidad=data.cantidad)
            session.add(item)
        session.commit()
        return {"mensaje": "Producto agregado al carrito"}

# Endpoint: Quitar producto del carrito
@app.delete("/carrito/{product_id}")
def quitar_carrito(product_id: int, Authorization: Optional[str] = Header(None)):
    usuario_id = get_usuario_id_from_token(Authorization.replace("Bearer ", "") if Authorization else None)
    if not usuario_id:
        raise HTTPException(status_code=401, detail="No autenticado")
    with Session(engine) as session:
        carrito = session.exec(select(Carrito).where(Carrito.usuario_id == usuario_id, Carrito.estado == "activo")).first()
        if not carrito:
            raise HTTPException(status_code=404, detail="Carrito no encontrado")
        item = session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito.id, CarritoItem.producto_id == product_id)).first()
        if not item:
            raise HTTPException(status_code=404, detail="Producto no está en el carrito")
        session.delete(item)
        session.commit()
        return {"mensaje": "Producto quitado del carrito"}

# Endpoint: Cancelar compra (vaciar carrito)
@app.post("/carrito/cancelar")
def cancelar_carrito(Authorization: Optional[str] = Header(None)):
    usuario_id = get_usuario_id_from_token(Authorization.replace("Bearer ", "") if Authorization else None)
    if not usuario_id:
        raise HTTPException(status_code=401, detail="No autenticado")
    with Session(engine) as session:
        carrito = session.exec(select(Carrito).where(Carrito.usuario_id == usuario_id, Carrito.estado == "activo")).first()
        if not carrito:
            return {"mensaje": "No hay carrito activo"}
        items = session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito.id)).all()
        for item in items:
            session.delete(item)
        session.commit()
        return {"mensaje": "Carrito cancelado y vaciado"}
import hashlib

# Montar directorio de imágenes como archivos estáticos
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Modelos para entrada JSON
class UsuarioRegistro(BaseModel):
    nombre: str
    email: str
    password: str

class UsuarioLogin(BaseModel):
    email: str
    password: str


# Endpoint: Iniciar sesión (JSON)
@app.post("/iniciar-sesion")
def iniciar_sesion(data: UsuarioLogin):
    with Session(engine) as session:
        usuario = session.exec(select(Usuario).where(Usuario.email == data.email)).first()
        if not usuario or hash_password(data.password) != usuario.password:
            raise HTTPException(status_code=401, detail="Credenciales inválidas.")
        # Simular token para pruebas
        token = f"fake-token-{usuario.id}"
        return {"access_token": token, "token_type": "bearer", "usuario_id": usuario.id, "nombre": usuario.nombre, "email": usuario.email}


@app.post("/registrar")
def registrar_usuario(data: UsuarioRegistro):
    with Session(engine) as session:
        existe = session.exec(select(Usuario).where(Usuario.email == data.email)).first()
        if existe:
            raise HTTPException(status_code=400, detail="El email ya está registrado.")
        usuario = Usuario(nombre=data.nombre, email=data.email, password=hash_password(data.password))
        session.add(usuario)
        session.commit()
        session.refresh(usuario)
        return {"mensaje": "Usuario registrado correctamente."}

@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}


def cargar_productos():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

# Endpoint: Listar productos con filtros
@app.get("/productos")
def obtener_productos(categoria: str = None, q: str = None):
    productos = cargar_productos()
    # Filtrar por categoría si se especifica
    if categoria:
        productos = [p for p in productos if p.get("categoria", "").lower() == categoria.lower()]
    # Filtrar por búsqueda si se especifica
    if q:
        productos = [p for p in productos if q.lower() in p.get("titulo", "").lower() or q.lower() in p.get("descripcion", "").lower()]
    # Marcar productos agotados
    for p in productos:
        if p.get("existencia", 0) <= 0:
            p["agotado"] = True
        else:
            p["agotado"] = False
    return productos

# Endpoint: Detalle de producto
@app.get("/productos/{id}")
def obtener_producto(id: int):
    productos = cargar_productos()
    for p in productos:
        if p.get("id") == id:
            if p.get("existencia", 0) <= 0:
                p["agotado"] = True
            else:
                p["agotado"] = False
            return p
    raise HTTPException(status_code=404, detail="Producto no encontrado")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
