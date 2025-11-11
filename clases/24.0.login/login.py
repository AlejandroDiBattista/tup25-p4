from fastapi import FastAPI, Depends, Response, Cookie, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

from sqlmodel import SQLModel, Field, Session, create_engine, select

from hashlib import sha256
from secrets import token_hex

from datetime import datetime, timedelta
from pathlib import Path


class Usuario(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    email: str = Field(index=True, unique=True)
    password_hash: str
    
    token: str|None = None
    token_expiration: str|None = None
        
engine = create_engine("sqlite:///usuarios.db")

def iniciar_base_datos():
    SQLModel.metadata.create_all(engine)
            
# DTOs 

class UsuarioRegistrar(SQLModel):
    nombre: str
    password: str
    email: str

class UsuarioLogin(SQLModel):
    email: str
    password: str
    
# Funciones para manejo de contraseñas
    
def crear_hash(password: str) -> str:
    """ Crea un hash SHA-256 de la contraseña proporcionada. """
    return sha256(password.encode('utf-8')).hexdigest()


def validar_contraseña(password: str, password_hash: str) -> bool:
    """ Valida si la contraseña coincide con el hash proporcionado. """
    return crear_hash(password) == password_hash


def generar_token() -> str:
    return token_hex(16)


def usuario_actual(token: str, session: Session) -> Usuario | None:
    cmd = select(Usuario).where(Usuario.token == token)
    # SQL = SELECT * FROM usuario WHERE token = ?
    usuario = session.exec(cmd).first()
    if usuario and usuario.token_expiration:
        expiracion = datetime.fromisoformat(usuario.token_expiration)
        if expiracion > datetime.now():
            return usuario
    return None

def usuario_desde_email(email: str, session: Session) -> Usuario | None:
    return session.exec(select(Usuario).where(Usuario.email == email)).first()


# Dependencias
def get_session():
    """ Dependencia para obtener sesión de DB """
    
    with Session(engine) as session:
        yield session
        session.commit()


def get_usuario(token: str = Cookie(), session: Session = Depends(get_session)) -> Usuario:
    """ Dependencia que obtiene el usuario autenticado actual """
    
    if not token:
        raise HTTPException(status_code=401, detail="No hay sesión activa")
    
    usuario = usuario_actual(token, session)
    if not usuario:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    
    return usuario


# Configuración de FastAPI

app = FastAPI()

# Configurar CORS para permitir acceso desde el HTML
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5504",
        "http://127.0.0.1:5504",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "null"  # Permite archivos abiertos directamente desde el sistema
    ],
    allow_credentials=True,  # Permite el envío de cookies
    allow_methods=["*"],  # Permite todos los métodos HTTP
    allow_headers=["*"],  # Permite todos los headers
)
    
static_dir = Path(__file__).parent
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/", include_in_schema=False)
def serve_login():
    return FileResponse(static_dir / "25.login.html")


@app.get("/api")
def read_root():
    return {"message": "API de Contactos - FastAPI + SQLModel"}


@app.post("/signup")
def registrar_usuario(usuario: UsuarioRegistrar, session: Session = Depends(get_session)):
    """ Registra un nuevo usuario """    
    
    if usuario_desde_email(usuario.email, session):
        return {"error": "El email ya está registrado"}

    nuevo = Usuario( nombre=usuario.nombre, password_hash=crear_hash(usuario.password), email=usuario.email )
    session.add(nuevo)
    
    return {"message": "Usuario registrado exitosamente"}


@app.post("/login")
def login_usuario(usuario: UsuarioLogin, response: Response, session: Session = Depends(get_session)):
    """ Loguea un usuario existente """
    
    usuario_db = usuario_desde_email(usuario.email, session)
    if not usuario_db or not validar_contraseña(usuario.password, usuario_db.password_hash):
        return {"error": "Credenciales inválidas"}
    
    usuario_db.token = generar_token()
    usuario_db.token_expiration = (datetime.now() + timedelta(seconds=3600)).isoformat()
    
    session.add(usuario_db)
    
    # Configurar cookie con el token
    response.set_cookie( key="token", value=usuario_db.token, max_age=3600, httponly=True, samesite="none", secure=True, )
    
    return {"message": "Login exitoso", "expiration": usuario_db.token_expiration}


@app.get("/logout")
def logout_usuario(response: Response, usuario: Usuario = Depends(get_usuario), session: Session = Depends(get_session)):
    """ Desloguea al usuario actual """
    
    usuario.token = None
    usuario.token_expiration = None
    
    session.add(usuario)
    
    # Eliminar la cookie
    response.delete_cookie(key="token", samesite="none", secure=True)
    
    return {"message": "Usuario deslogueado exitosamente"}


@app.get("/perfil")
def obtener_perfil_usuario(usuario: Usuario = Depends(get_usuario)):
    """ Obtiene el perfil del usuario actual """
    
    return {
        "id": usuario.id,
        "nombre": usuario.nombre,
        "email": usuario.email
    }

if __name__ == "__main__":
    iniciar_base_datos()
    uvicorn.run(app, host="0.0.0.0", port=8000)