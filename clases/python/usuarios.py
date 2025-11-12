import secrets
import hashlib

from datetime import datetime, timedelta

from fastapi  import FastAPI, Response
from sqlmodel import SQLModel, Field, create_engine, Session, select


## Modelos de datos para usuarios
class Usuario(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    nombre: str
    apellido: str
    email: str

    # Almacenamos el hash de la contraseña, no la contraseña en texto plano    
    hash_password:      str
    session_token:      str|None = Field(default=None, index=True)
    session_expiration: datetime|None = Field(default=None)
    
    
## DTOs para registro y login
class UsuarioRegistrar(SQLModel):
    nombre: str
    apellido: str
    email: str
    password: str
    
class UsuarioLogin(SQLModel):
    email: str
    password: str


engine = create_engine("sqlite:///database.db")


def generar_hash(password: str) -> str:
    """Hashea una contraseña usando SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()

def verificar_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si una contraseña coincide con su hash."""
    return generar_hash(plain_password) == hashed_password

def generar_token() -> str:
    """Genera un token de sesión seguro usando secrets."""
    return secrets.token_hex(32)


def iniciar_sesion(usuario: Usuario, duracion_segundos: int = 3600) -> str:
    """Inicia una sesión para el usuario, generando un token y estableciendo la expiración."""
    token = generar_token()
    usuario.session_token = token
    usuario.session_expiration = datetime.now() + timedelta(seconds=duracion_segundos)
    return token
    

def usuario_logeado(token: str) -> Usuario|None:
    """Devuelve el usuario asociado al token de sesión si está logeado."""
    with Session(engine) as session:
        usuario = session.exec( select(Usuario).where(Usuario.session_token == token) ).first()
        if usuario and usuario.session_expiration and usuario.session_expiration > datetime.now():
            return usuario
    return None

def esta_logeado(token: str) -> bool:
    """Verifica si el token de sesión corresponde a un usuario logeado."""
    return usuario_logeado(token) is not None


app = FastAPI()

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine) 


@app.post("/registrar/")
async def registrar(usuario: UsuarioRegistrar):
    hashed_password = generar_hash(usuario.password)
    nuevo_usuario = Usuario(**usuario.model_dump(), hash_password=hashed_password)
    
    # Aquí iría la lógica para guardar en la base de datos
    with Session(engine) as session:
        session.add(nuevo_usuario)
        session.commit()
        session.refresh(nuevo_usuario)
    return {"mensaje": "Usuario registrado exitosamente", "usuario_id": nuevo_usuario.id}


@app.post("/login/")
async def login(response: Response, email: str, password: str):
    """Endpoint de login que verifica la contraseña."""

    with Session(engine) as session:
        usuario = session.exec( select(Usuario).where(Usuario.email == email) ).first()

        if not usuario or not verificar_password(password, usuario.hash_password):
            return {"error": "Credenciales inválidas"}
        
        # Generar nuevo token de sesión
        nuevo_token = iniciar_sesion(usuario, 3600)
        session.add(usuario)
        session.commit()
        
        response.set_cookie( key="session_token", value=nuevo_token, max_age=3600, )
        return {"mensaje": "Login exitoso"}
    

@app.post("/logout/")
async def logout(response: Response, session_token: str):
    """Endpoint de logout que invalida la sesión."""
    with Session(engine) as session:
        usuario = session.exec( select(Usuario).where(Usuario.session_token == session_token) ).first()
        
        if usuario:
            usuario.session_token      = None
            usuario.session_expiration = None
            session.add(usuario)
            session.commit()
    
    # Eliminar la cookie de sesión
    response.delete_cookie(key="session_token")
    return {"mensaje": "Logout exitoso"}    

@app.get("/usuarios/")
async def obtener_usuarios(session_token: str):
    """ Trae la lista de todos los usuarios registrados. Si esta autenticado. (requiere cookie de sesión) """
    
    with Session(engine) as session:
        usuario = session.exec( select(Usuario).where(Usuario.session_token == session_token) ).first()
        
        if not usuario or (usuario.session_expiration and usuario.session_expiration < datetime.now()):
            return {"error": "Sesión inválida o expirada"}
        
        usuarios = session.exec(select(Usuario)).all()
        return {"usuarios": usuarios}

# Aquí podrías agregar más endpoints relacionados con usuarios