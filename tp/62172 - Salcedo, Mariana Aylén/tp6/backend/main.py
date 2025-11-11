from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
import json
from pathlib import Path
from typing import Optional

from database import create_db_and_tables, get_session
from models.usuario import Usuario, UsuarioCreate, UsuarioLogin, UsuarioResponse, Token
from auth import hash_password, verify_password, create_access_token, verify_token

app = FastAPI(title="API E-Commerce")

# Crear tablas al iniciar
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Security
security = HTTPBearer()

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

# Dependencia para obtener usuario actual
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> Usuario:
    """Obtener el usuario actual desde el token JWT"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado"
        )
    
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    
    usuario = session.exec(select(Usuario).where(Usuario.email == email)).first()
    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado"
        )
    
    return usuario

# Cargar productos desde el archivo JSON
def cargar_productos():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

@app.get("/")
def root():
    return {"mensaje": "API E-Commerce - Endpoints: /productos, /registrar, /iniciar-sesion"}

@app.get("/productos")
def obtener_productos(
    busqueda: Optional[str] = None,
    categoria: Optional[str] = None
):
    productos = cargar_productos()
    
    # Filtrar por búsqueda (en nombre o descripción)
    if busqueda:
        busqueda_lower = busqueda.lower()
        productos = [
            p for p in productos
            if busqueda_lower in p["nombre"].lower() or busqueda_lower in p["descripcion"].lower()
        ]
    
    # Filtrar por categoría
    if categoria and categoria != "todas":
        productos = [p for p in productos if p["categoria"] == categoria]
    
    return productos

@app.get("/productos/{producto_id}")
def obtener_producto(producto_id: int):
    """Obtener un producto específico por ID"""
    productos = cargar_productos()
    producto = next((p for p in productos if p["id"] == producto_id), None)
    
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    return producto

# ===== ENDPOINTS DE AUTENTICACIÓN =====

@app.post("/registrar", response_model=Token, status_code=status.HTTP_201_CREATED)
def registrar_usuario(usuario_data: UsuarioCreate, session: Session = Depends(get_session)):
    """Registrar un nuevo usuario"""
    # Verificar si el email ya existe
    usuario_existente = session.exec(
        select(Usuario).where(Usuario.email == usuario_data.email)
    ).first()
    
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # Crear nuevo usuario
    password_hash = hash_password(usuario_data.password)
    nuevo_usuario = Usuario(
        nombre=usuario_data.nombre,
        email=usuario_data.email,
        password_hash=password_hash
    )
    
    session.add(nuevo_usuario)
    session.commit()
    session.refresh(nuevo_usuario)
    
    # Crear token
    access_token = create_access_token(data={"sub": nuevo_usuario.email})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        usuario=UsuarioResponse(
            id=nuevo_usuario.id,
            nombre=nuevo_usuario.nombre,
            email=nuevo_usuario.email
        )
    )

@app.post("/iniciar-sesion", response_model=Token)
def iniciar_sesion(credenciales: UsuarioLogin, session: Session = Depends(get_session)):
    """Iniciar sesión"""
    # Buscar usuario
    usuario = session.exec(
        select(Usuario).where(Usuario.email == credenciales.email)
    ).first()
    
    if not usuario or not verify_password(credenciales.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    # Crear token
    access_token = create_access_token(data={"sub": usuario.email})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        usuario=UsuarioResponse(
            id=usuario.id,
            nombre=usuario.nombre,
            email=usuario.email
        )
    )

@app.post("/cerrar-sesion")
def cerrar_sesion(usuario_actual: Usuario = Depends(get_current_user)):
    """Cerrar sesión (en cliente se debe eliminar el token)"""
    return {"mensaje": "Sesión cerrada exitosamente"}

@app.get("/usuario-actual", response_model=UsuarioResponse)
def obtener_usuario_actual(usuario_actual: Usuario = Depends(get_current_user)):
    """Obtener información del usuario actual"""
    return UsuarioResponse(
        id=usuario_actual.id,
        nombre=usuario_actual.nombre,
        email=usuario_actual.email
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
