from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from pathlib import Path
from typing import List
from datetime import timedelta
import json
import re

# Importar configuración de base de datos y modelos
from database import crear_tablas, get_session, inicializar_datos
from models.productos import Producto, ProductoPublico
from models.usuarios import Usuario, UsuarioRegistro, UsuarioLogin, UsuarioPublico, Token
from auth import (
    get_password_hash, autenticar_usuario, crear_access_token,
    get_usuario_activo_actual, ACCESS_TOKEN_EXPIRE_MINUTES
)

# Crear la aplicación FastAPI
app = FastAPI(
    title="API E-Commerce",
    description="API para sistema de comercio electrónico con FastAPI y SQLModel",
    version="1.0.0"
)

# Montar directorio de imágenes como archivos estáticos
imagenes_dir = Path(__file__).parent / "imagenes"
app.mount("/imagenes", StaticFiles(directory=str(imagenes_dir)), name="imagenes")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Función para cargar productos desde JSON
def cargar_productos():
    """Cargar productos desde el archivo JSON"""
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

# Evento de inicio - crear tablas y cargar datos
@app.on_event("startup")
def on_startup():
    """Inicializar base de datos al arrancar la aplicación"""
    crear_tablas()
    inicializar_datos()

# ===============================================
# ENDPOINTS BÁSICOS
# ===============================================

@app.get("/")
def root():
    return {"mensaje": "API de E-Commerce - use /productos para obtener el listado"}

@app.get("/health")
def health_check():
    from datetime import datetime
    return {"status": "ok", "timestamp": datetime.now()}

@app.get("/productos", response_model=List[ProductoPublico])
def obtener_productos(session: Session = Depends(get_session)):
    """Obtener lista de productos desde la base de datos"""
    productos = session.exec(select(Producto)).all()
    return productos

@app.get("/productos/{producto_id}", response_model=ProductoPublico)
def obtener_producto(producto_id: int, session: Session = Depends(get_session)):
    """Obtener un producto específico por ID"""
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

@app.get("/categorias")
def obtener_categorias(session: Session = Depends(get_session)):
    """Obtener lista de categorías disponibles"""
    query = select(Producto.categoria).distinct()
    categorias = session.exec(query).all()
    return {"categorias": categorias}

# ===============================================
# ENDPOINTS DE AUTENTICACIÓN
# ===============================================

@app.post("/registrar", response_model=UsuarioPublico)
def registrar_usuario(usuario_data: UsuarioRegistro, session: Session = Depends(get_session)):
    """Registrar un nuevo usuario"""
    
    # Verificar si el email ya existe
    usuario_existente = session.exec(
        select(Usuario).where(Usuario.email == usuario_data.email)
    ).first()
    
    if usuario_existente:
        raise HTTPException(
            status_code=400,
            detail="El email ya está registrado"
        )
    
    # Validar formato de email básico
    if not re.match(r"^[^@]+@[^@]+\.[^@]+$", usuario_data.email):
        raise HTTPException(
            status_code=400,
            detail="Formato de email inválido"
        )
    
    # Crear nuevo usuario
    usuario_dict = usuario_data.model_dump()
    password = usuario_dict.pop("password")
    usuario_dict["password_hash"] = get_password_hash(password)
    
    usuario = Usuario(**usuario_dict)
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    
    return usuario

@app.post("/iniciar-sesion", response_model=Token)
def iniciar_sesion(form_data: UsuarioLogin, session: Session = Depends(get_session)):
    """Iniciar sesión y obtener token de acceso"""
    usuario = autenticar_usuario(form_data.email, form_data.password, session)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = crear_access_token(
        data={"sub": usuario.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/perfil", response_model=UsuarioPublico)
def obtener_perfil(usuario_actual: Usuario = Depends(get_usuario_activo_actual)):
    """Obtener perfil del usuario actual"""
    return usuario_actual

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
