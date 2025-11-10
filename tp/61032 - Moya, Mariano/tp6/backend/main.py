
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from models.db_models import Usuario
from init_db import engine
import json
from pathlib import Path
import hashlib

app = FastAPI(title="API Productos")

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
