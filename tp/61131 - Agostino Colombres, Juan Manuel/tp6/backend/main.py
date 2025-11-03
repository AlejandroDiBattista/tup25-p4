import hashlib
import json
import secrets
from pathlib import Path
from typing import Dict

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from sqlmodel import Session, select

from database import create_db_and_tables, get_session
from models import Usuario

# Tokens en memoria para sesiones simples de desarrollo.
TOKENS: Dict[str, int] = {}


def hash_password(password: str) -> str:
    """Devuelve un hash estable para la contraseña ingresada."""

    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, hashed_password: str) -> bool:
    return hash_password(password) == hashed_password


class RegistroRequest(BaseModel):
    nombre: str
    email: EmailStr
    password: str


class RegistroResponse(BaseModel):
    id: int
    nombre: str
    email: EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

app = FastAPI(title="API Productos")

# Montar directorio de imágenes como archivos estáticos
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar productos desde el archivo JSON
def cargar_productos():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)


@app.post("/registrar", response_model=RegistroResponse, status_code=status.HTTP_201_CREATED)
def registrar_usuario(payload: RegistroRequest, session: Session = Depends(get_session)) -> RegistroResponse:
    """Crea un nuevo usuario con la contraseña hasheada."""

    existente = session.exec(select(Usuario).where(Usuario.email == payload.email)).first()
    if existente:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El email ya está registrado")

    usuario = Usuario(
        nombre=payload.nombre,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    session.add(usuario)
    session.commit()
    session.refresh(usuario)

    return RegistroResponse(id=usuario.id, nombre=usuario.nombre, email=usuario.email)


@app.post("/iniciar-sesion", response_model=TokenResponse)
def iniciar_sesion(payload: LoginRequest, session: Session = Depends(get_session)) -> TokenResponse:
    """Verifica credenciales y devuelve un token en memoria."""

    usuario = session.exec(select(Usuario).where(Usuario.email == payload.email)).first()
    if not usuario or not verify_password(payload.password, usuario.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")

    token = secrets.token_hex(32)
    TOKENS[token] = usuario.id
    return TokenResponse(access_token=token)


@app.on_event("startup")
def on_startup() -> None:
    """Inicializa la base de datos al arrancar la aplicación."""
    create_db_and_tables()

@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}

@app.get("/productos")
def obtener_productos():
    productos = cargar_productos()
    return productos

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
