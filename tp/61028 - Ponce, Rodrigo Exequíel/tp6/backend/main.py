from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
import json
from pathlib import Path
from datetime import timedelta
from sqlmodel import Session, select
from models.database import create_db_and_tables, engine, get_session
from models import Usuario, Producto
from typing import List, Optional
from schemas.producto_schema import ProductoResponse, ProductoFilter
from services.producto_service import ProductoService
from auth.schemas import UsuarioCreate, Token, UsuarioResponse
from auth.security import (
    get_password_hash,
    crear_token_acceso,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_usuario_actual,
    verificar_password
)

app = FastAPI(title="Tienda API")

# Montar directorio de imágenes como archivos estáticos
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    create_db_and_tables()

# Cargar productos desde el archivo JSON
def cargar_productos():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

@app.post("/registrar", response_model=UsuarioResponse)
async def registrar_usuario(usuario: UsuarioCreate):
    with Session(engine) as session:
        # Verificar si el email ya existe
        existe = session.exec(
            select(Usuario).where(Usuario.email == usuario.email)
        ).first()
        if existe:
            raise HTTPException(
                status_code=400,
                detail="El email ya está registrado"
            )
        
        # Crear nuevo usuario
        nuevo_usuario = Usuario(
            nombre=usuario.nombre,
            email=usuario.email,
            password_hash=get_password_hash(usuario.password)
        )
        session.add(nuevo_usuario)
        session.commit()
        session.refresh(nuevo_usuario)
        
        return nuevo_usuario

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        usuario = session.exec(
            select(Usuario).where(Usuario.email == form_data.username)
        ).first()
        if not usuario or not verificar_password(form_data.password, usuario.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = crear_token_acceso(
            data={"sub": usuario.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

@app.post("/cerrar-sesion")
async def cerrar_sesion(usuario_actual: Usuario = Depends(get_usuario_actual)):
    # En una implementación real, aquí se invalidaría el token
    return {"mensaje": "Sesión cerrada exitosamente"}

@app.get("/me", response_model=UsuarioResponse)
async def obtener_usuario_actual(usuario_actual: Usuario = Depends(get_usuario_actual)):
    return usuario_actual

@app.get("/")
def root():
    return {"mensaje": "API de la Tienda - Bienvenido"}

from typing import List
from schemas.producto_schema import ProductoResponse, ProductoFilter
from services.producto_service import ProductoService

@app.get("/productos", response_model=List[ProductoResponse])
async def obtener_productos(
    filtros: ProductoFilter = Depends(),
    session: Session = Depends(get_session)
):
    """
    Obtiene lista de productos con filtros opcionales:
    - busqueda: Búsqueda por nombre o descripción
    - categoria: Filtrar por categoría
    - precio_min: Precio mínimo
    - precio_max: Precio máximo
    - disponibles: Solo productos con existencia > 0
    """
    await ProductoService.cargar_productos_iniciales(session)
    return await ProductoService.obtener_productos(session, filtros)

@app.get("/productos/{producto_id}", response_model=ProductoResponse)
async def obtener_producto(
    producto_id: int,
    session: Session = Depends(get_session)
):
    """Obtiene un producto específico por su ID"""
    producto = await ProductoService.obtener_producto(session, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

@app.get("/categorias", response_model=List[str])
async def obtener_categorias(session: Session = Depends(get_session)):
    """Obtiene la lista de categorías disponibles"""
    await ProductoService.cargar_productos_iniciales(session)
    return await ProductoService.obtener_categorias(session)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
