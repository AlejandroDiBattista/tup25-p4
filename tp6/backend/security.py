from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import jwt

# Configuración de hash de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuración JWT
SECRET_KEY = "tu-clave-secreta-muy-segura-cambiar-en-produccion"  # ⚠️ CAMBIAR EN PRODUCCIÓN
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def hash_password(password: str) -> str:
    """Hashea una contraseña"""
    # Asegurarse de recibir una cadena
    if password is None:
        password = ""
    if isinstance(password, bytes):
        try:
            password = password.decode("utf-8")
        except Exception:
            password = str(password)

    # Bcrypt tiene un límite de 72 bytes; truncar si es necesario para evitar ValueError
    try:
        pw_bytes = password.encode("utf-8")
    except Exception:
        pw_bytes = str(password).encode("utf-8", errors="ignore")

    if len(pw_bytes) > 72:
        # Truncamos a 72 bytes y redecodificamos ignorando bytes incompletos al final
        pw_bytes = pw_bytes[:72]
        try:
            password = pw_bytes.decode("utf-8")
        except Exception:
            # Fallback seguro
            password = pw_bytes.decode("latin-1", errors="ignore")

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica una contraseña contra su hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Crea un JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """Decodifica un JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.InvalidTokenError:
        return None
