from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
import json
from pathlib import Path
from typing import Optional

# Importar modelos y database
from models import Producto, Usuario, Carrito
from database import create_db_and_tables, get_session, engine
from sqlmodel import Session, select

# Importar funciones de autenticación
from auth import obtener_hash_contraseña, verificar_contraseña, crear_access_token
from dependencies import get_current_user

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


# ========================================
# MODELOS PYDANTIC PARA REQUESTS/RESPONSES
# ========================================

class RegistroRequest(BaseModel):
    """Modelo para registro de usuario."""
    nombre: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    """Modelo para inicio de sesión."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Modelo para respuesta de token."""
    access_token: str
    token_type: str = "bearer"


class MensajeResponse(BaseModel):
    """Modelo para mensajes generales."""
    mensaje: str


# Evento de inicio: crear tablas y cargar datos iniciales
@app.on_event("startup")
def on_startup():
    """Inicializar base de datos y cargar productos desde JSON."""
    # Crear todas las tablas
    create_db_and_tables()
    
    # Cargar productos desde JSON si la tabla está vacía
    with Session(engine) as session:
        productos_existentes = session.exec(select(Producto)).first()
        
        if not productos_existentes:
            # Cargar productos desde el archivo JSON
            ruta_productos = Path(__file__).parent / "productos.json"
            with open(ruta_productos, "r", encoding="utf-8") as archivo:
                productos_json = json.load(archivo)
            
            # Insertar productos en la base de datos
            for producto_data in productos_json:
                producto = Producto(
                    id=producto_data["id"],
                    nombre=producto_data["titulo"],
                    descripcion=producto_data["descripcion"],
                    precio=producto_data["precio"],
                    categoria=producto_data["categoria"],
                    existencia=producto_data["existencia"],
                    imagen=producto_data["imagen"]
                )
                session.add(producto)
            
            session.commit()
            print(f"✅ {len(productos_json)} productos cargados en la base de datos")


@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}


@app.get("/productos")
def obtener_productos():
    """Obtener todos los productos de la base de datos."""
    with Session(engine) as session:
        productos = session.exec(select(Producto)).all()
        return productos


# ========================================
# ENDPOINTS DE AUTENTICACIÓN
# ========================================

@app.post("/registrar", response_model=MensajeResponse, status_code=status.HTTP_201_CREATED)
def registrar_usuario(datos: RegistroRequest):
    """
    Registrar un nuevo usuario en el sistema.
    
    - Valida que el email no esté registrado
    - Hashea la contraseña con bcrypt
    - Crea el usuario en la base de datos
    - Crea un carrito activo para el usuario
    """
    with Session(engine) as session:
        # Verificar si el email ya está registrado
        usuario_existente = session.exec(
            select(Usuario).where(Usuario.email == datos.email)
        ).first()
        
        if usuario_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
        
        # Crear nuevo usuario con contraseña hasheada
        nuevo_usuario = Usuario(
            nombre=datos.nombre,
            email=datos.email,
            contraseña=obtener_hash_contraseña(datos.password)
        )
        session.add(nuevo_usuario)
        session.commit()
        session.refresh(nuevo_usuario)
        
        # Crear carrito activo para el nuevo usuario
        carrito = Carrito(
            usuario_id=nuevo_usuario.id,
            estado="activo"
        )
        session.add(carrito)
        session.commit()
        
        return MensajeResponse(mensaje="Usuario registrado exitosamente")


@app.post("/iniciar-sesion", response_model=TokenResponse)
def iniciar_sesion(datos: LoginRequest):
    """
    Iniciar sesión con email y contraseña.
    
    - Valida que el usuario exista
    - Verifica la contraseña con bcrypt
    - Genera y retorna un JWT con 30 minutos de expiración
    """
    with Session(engine) as session:
        # Buscar usuario por email
        usuario = session.exec(
            select(Usuario).where(Usuario.email == datos.email)
        ).first()
        
        # Validar credenciales
        if not usuario or not verificar_contraseña(datos.password, usuario.contraseña):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Crear token JWT
        access_token = crear_access_token(data={"sub": usuario.email})
        
        return TokenResponse(access_token=access_token)


@app.post("/cerrar-sesion", response_model=MensajeResponse)
def cerrar_sesion(usuario_actual: Usuario = Depends(get_current_user)):
    """
    Cerrar sesión del usuario actual.
    
    Nota: Con JWT stateless, el token seguirá siendo válido hasta su expiración.
    El cliente debe eliminar el token de su almacenamiento local.
    
    Requiere autenticación (Bearer token).
    """
    # En una implementación real, aquí se podría agregar el token a una blacklist
    # Por ahora, simplemente confirmamos que el usuario está autenticado
    return MensajeResponse(
        mensaje=f"Sesión cerrada exitosamente para {usuario_actual.nombre}"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
