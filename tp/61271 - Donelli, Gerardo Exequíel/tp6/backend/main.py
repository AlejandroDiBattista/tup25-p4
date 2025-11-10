from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import SQLModel, create_engine, Session, select
from pydantic import BaseModel, EmailStr
from typing import Optional, Annotated
import json
from pathlib import Path

# Importar todos los modelos
from models import Usuario, Producto, Carrito, ItemCarrito, Compra, ItemCompra
# Importar funciones de autenticación
from auth import hashear_contraseña, verificar_contraseña, crear_access_token, verificar_token

# Configuración de la base de datos
DATABASE_URL = "sqlite:///./ecommerce.db"
engine = create_engine(DATABASE_URL, echo=True)

# Crear la aplicación FastAPI
app = FastAPI(title="API E-Commerce")

# Configuración de seguridad
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


def crear_tablas():
    """Crear todas las tablas en la base de datos."""
    SQLModel.metadata.create_all(engine)


def obtener_session():
    """Dependencia para obtener una sesión de base de datos."""
    with Session(engine) as session:
        yield session


# Schemas Pydantic para requests/responses
class UsuarioRegistro(BaseModel):
    """Schema para registrar un nuevo usuario."""
    nombre: str
    email: EmailStr
    contraseña: str


class UsuarioLogin(BaseModel):
    """Schema para iniciar sesión."""
    email: EmailStr
    contraseña: str


class TokenResponse(BaseModel):
    """Schema para la respuesta del token."""
    access_token: str
    token_type: str = "bearer"
    usuario: dict


# Dependencia para obtener el usuario actual desde el token
def obtener_usuario_actual(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    session: Annotated[Session, Depends(obtener_session)]
) -> Usuario:
    """
    Obtiene el usuario actual desde el token JWT.
    
    Args:
        credentials: Credenciales HTTP Bearer
        session: Sesión de base de datos
        
    Returns:
        Usuario autenticado
        
    Raises:
        HTTPException: Si el token es inválido o el usuario no existe
    """
    token = credentials.credentials
    payload = verificar_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    usuario = session.exec(select(Usuario).where(Usuario.email == email)).first()
    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return usuario


@app.on_event("startup")
def on_startup():
    """Ejecutar al iniciar la aplicación."""
    crear_tablas()
    print("✅ Base de datos inicializada y tablas creadas")


# Cargar productos desde el archivo JSON (temporal, se migrará a BD)
def cargar_productos():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)


@app.get("/")
def root():
    return {"mensaje": "API E-Commerce - Bienvenido"}


# ==================== ENDPOINTS DE AUTENTICACIÓN ====================

@app.post("/registrar", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def registrar_usuario(
    usuario_data: UsuarioRegistro,
    session: Annotated[Session, Depends(obtener_session)]
):
    """
    Registra un nuevo usuario en el sistema.
    
    Args:
        usuario_data: Datos del usuario a registrar
        session: Sesión de base de datos
        
    Returns:
        Token de acceso y datos del usuario
        
    Raises:
        HTTPException: Si el email ya está registrado
    """
    # Verificar si el email ya existe
    usuario_existente = session.exec(
        select(Usuario).where(Usuario.email == usuario_data.email)
    ).first()
    
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # Crear nuevo usuario con contraseña hasheada
    nuevo_usuario = Usuario(
        nombre=usuario_data.nombre,
        email=usuario_data.email,
        password=hashear_contraseña(usuario_data.contraseña)
    )
    
    session.add(nuevo_usuario)
    session.commit()
    session.refresh(nuevo_usuario)
    
    # Crear token de acceso
    access_token = crear_access_token(data={"sub": nuevo_usuario.email})
    
    return TokenResponse(
        access_token=access_token,
        usuario={
            "id": nuevo_usuario.id,
            "nombre": nuevo_usuario.nombre,
            "email": nuevo_usuario.email
        }
    )


@app.post("/iniciar-sesion", response_model=TokenResponse)
def iniciar_sesion(
    credenciales: UsuarioLogin,
    session: Annotated[Session, Depends(obtener_session)]
):
    """
    Inicia sesión y obtiene un token de autenticación.
    
    Args:
        credenciales: Email y contraseña del usuario
        session: Sesión de base de datos
        
    Returns:
        Token de acceso y datos del usuario
        
    Raises:
        HTTPException: Si las credenciales son incorrectas
    """
    # Buscar usuario por email
    usuario = session.exec(
        select(Usuario).where(Usuario.email == credenciales.email)
    ).first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    # Verificar contraseña
    if not verificar_contraseña(credenciales.contraseña, usuario.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    # Crear token de acceso
    access_token = crear_access_token(data={"sub": usuario.email})
    
    return TokenResponse(
        access_token=access_token,
        usuario={
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email
        }
    )


@app.post("/cerrar-sesion")
def cerrar_sesion(
    usuario_actual: Annotated[Usuario, Depends(obtener_usuario_actual)]
):
    """
    Cierra la sesión del usuario actual.
    
    Nota: En JWT stateless, el cierre de sesión es manejado por el cliente
    eliminando el token. Este endpoint existe para cumplir con la especificación
    y puede ser extendido para implementar una lista negra de tokens si se requiere.
    
    Args:
        usuario_actual: Usuario autenticado
        
    Returns:
        Mensaje de confirmación
    """
    return {
        "mensaje": "Sesión cerrada exitosamente",
        "usuario": usuario_actual.nombre
    }


# ==================== ENDPOINTS DE PRODUCTOS ====================

@app.get("/productos")
def obtener_productos():
    """Obtener lista de productos (temporal desde JSON)."""
    productos = cargar_productos()
    return productos


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
