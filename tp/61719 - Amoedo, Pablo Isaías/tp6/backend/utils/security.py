from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt

# Contexto de hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Clave secreta y algoritmo
SECRET_KEY = "clave_super_secreta"  # Podés moverla a .env si querés
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Hasheo y verificación de contraseñas
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Generación de token JWT
def crear_token(datos: dict) -> str:
    to_encode = datos.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

