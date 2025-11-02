from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select, Optional
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
import json
from pathlib import Path
from database import crear_db, get_session
from models import *

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

# Cargar productos desde el archivo JSON
def cargar_productos():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}

@app.on_event("startup")
def on_startup():
    crear_db()


@app.post("/registrar")
def registrar(data: dict, session: Session=Depends(get_session)):
    nombre = data.get("nombre")
    email = data.get("email")
    contraseña = data.get("contraseña")

    if session.exec(select(Usuario).where(Usuario.email == email)).first():
        raise HTTPException(status_code=status_code=400, detail="El email ya está registrado")

    usuario = Usuario(nombre=nombre, email=email, contraseña=hash_contraseña(contraseña))
    session.add(usuario)
    session.commit()
    return {"mensaje": "Usuario registrado exitosamente"}


@app.post("/iniciar-sesion")
def iniciar_sesion(data: dict, session: Session=Depends(get_session)):
    email = data.get("email")
    contraseña = data.get("contraseña")

    usuario = session.exec(select(Usuario).where(Usuario.email == email)).first()
    if not usuario or not verificar_contraseña(contraseña, usuario.contraseña):
        raise HTTPException(status_code=status_code=401, detail="Credenciales inválidas")
    
    token = crear_token({"sub": usuario.email})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/cerrar-sesion")
def cerrar_sesion():
    return {"mensaje": "Sesión cerrada exitosamente"}


@app.get("/productos")
def listar_productos(
    buscar: Optional[str] = None,
    categoria: Optional[str] = None,
    session: Session = Depends(get_session)):
    query = select(Producto)
    if buscar:
        query = query.where(Producto.nombre.contains(buscar))
    if categoria:
        query = query.where(Producto.categoria.contains(categoria))
    return session.exec(query).all()

@app.get("/productos/{producto_id}")
def obtener_producto(producto_id: int, session: Session=Depends(get_session)):
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
