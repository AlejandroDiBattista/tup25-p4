from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "supersecreto"
ALGORITHM = "HS256"

# Usar argon2 en lugar de bcrypt (sin límite de 72 caracteres)
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_token(data: dict, expires_minutes=60):
    data_copy = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    data_copy.update({"exp": expire})
    return jwt.encode(data_copy, SECRET_KEY, algorithm=ALGORITHM)