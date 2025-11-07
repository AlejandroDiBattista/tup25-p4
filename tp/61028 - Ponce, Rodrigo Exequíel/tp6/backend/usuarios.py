from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel
from datetime import datetime, timedelta
import sqlite3

router = APIRouter()

# Configuración básica de seguridad
SECRET_KEY = "tp6-secret-key"  # podés cambiarlo por uno más largo
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 día
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="iniciar-sesion")


# ------------------------------
# Base de datos SQLite de usuarios
# ------------------------------
def get_db_connection():
    conn = sqlite3.connect("usuarios.db")
    conn.row_factory = sqlite3.Row
    return conn

def crear_tabla_usuarios():
    conn = get_db_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

crear_tabla_usuarios()

# ------------------------------
# Modelos Pydantic
# ------------------------------
class UserIn(BaseModel):
    nombre: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ------------------------------
# Funciones de utilidad
# ------------------------------
def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ------------------------------
# Endpoints
# ------------------------------
@router.post("/registrar")
def registrar(usuario: UserIn):
    conn = get_db_connection()
    existing = conn.execute("SELECT * FROM usuarios WHERE email = ?", (usuario.email,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    hashed_pw = get_password_hash(usuario.password)
    conn.execute("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
                 (usuario.nombre, usuario.email, hashed_pw))
    conn.commit()
    conn.close()
    return {"mensaje": "Usuario registrado correctamente"}

@router.post("/iniciar-sesion", response_model=Token)
def iniciar_sesion(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM usuarios WHERE email = ?", (form_data.username,)).fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")
    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    token = create_access_token({"sub": str(user["id"])})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/cerrar-sesion")
def cerrar_sesion(token: str = Depends(oauth2_scheme)):
    # Simulación: en un sistema real se invalidaría el token
    return {"mensaje": "Sesión cerrada correctamente"}
