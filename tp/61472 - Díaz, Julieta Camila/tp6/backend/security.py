from datetime import datetime, timedelta
from typing import Optional

# Imports para Hashing
from passlib.context import CryptContext

# Imports para JWT y Autenticación
from jose import jwt, JWTError
from fastapi import HTTPException, status, Depends
# Nota: Si usaras el esquema estándar de FastAPI, necesitarías de 'fastapi.security import OAuth2PasswordBearer'

# Importaciones de archivos locales
from database import get_session 
from models import Usuario # Necesitamos el modelo Usuario para buscar el usuario por email
from sqlmodel import Session, select

# ----------------------------------
# Configuración de Hashing (bcrypt)
# ----------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si la contraseña plana coincide con el hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Genera el hash bcrypt de una contraseña."""
    return pwd_context.hash(password)

# ----------------------------------
# Configuración de JWT (Tokens)
# ----------------------------------

# CLAVE SECRETA: debe ser muy larga y mantenerse en secreto.
# ¡IMPORTANTE! Cámbiala por una cadena aleatoria y guárdala en una variable de entorno en producción.
SECRET_KEY = "ESTA_ES_LA_CLAVE_SECRETA_PARA_JWT_CAMBIALA_EN_PRODUCCION" 
ALGORITHM = "HS256"
# El token expira en 30 minutos
ACCESS_TOKEN_EXPIRE_MINUTES = 30 

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Crea un nuevo JSON Web Token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # El campo 'sub' (subject) es típicamente el identificador del usuario (ej: email)
    to_encode.update({"exp": expire, "sub": data["email"]}) 
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ----------------------------------
# Dependencia para Usuario Autenticado (Protección de Rutas)
# ----------------------------------

def get_current_user(
    # Nota: Aquí deberías recibir el token del header Authorization con Depends(oauth2_scheme)
    # Por simplicidad, asumimos que se recibe el token directamente como string.
    token: str, 
    session: Session = Depends(get_session)
) -> Usuario:
    """
    Decodifica el token JWT, verifica su validez y retorna el objeto Usuario.
    Esta función es una dependencia clave para proteger los endpoints.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # 1. Decodificar el token (verificando firma y expiración)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub") # El 'sub' es nuestro identificador (email)
        
        if user_email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # 2. Buscar el usuario en la DB
    user = session.exec(select(Usuario).where(Usuario.email == user_email)).first()
    
    if user is None:
        raise credentials_exception
        
    return user