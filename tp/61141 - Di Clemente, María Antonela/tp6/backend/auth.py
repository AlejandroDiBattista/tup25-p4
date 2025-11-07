from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from .models import Usuario
from .database import engine

SECRET_KEY = "contraseña_secreta"  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="iniciar-sesion")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(email: str):
    with Session(engine) as session:
        user = session.exec(select(Usuario).where(Usuario.email == email)).first()
        return user

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        user = get_user(email)
        if user is None:
            raise HTTPException(status_code=401, detail="no se encontro el usuario")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

# REGISTRO DE USUARIO
def registrar_usuario(usuario: Usuario, session: Session):
    # Verificar si el email ya está registrado
    existe = session.exec(select(Usuario).where(Usuario.email == usuario.email)).first()
    if existe:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

# Guardar la contraseña en forma encriptada para mayor seguridad
    usuario.contraseña = get_password_hash(usuario.contraseña)
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    return {"mensaje": "Usuario registrado correctamente", "usuario": usuario.email}


#  INICIO DE SESIÓN
def iniciar_sesion(usuario: Usuario, session: Session):
    # Buscar usuario por email
    db_usuario = session.exec(select(Usuario).where(Usuario.email == usuario.email)).first()
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Verificar la contraseña
    if not verify_password(usuario.contraseña, db_usuario.contraseña):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    # Crear token JWT
    access_token = create_access_token(data={"sub": db_usuario.email})
    return {
        "mensaje": "Inicio de sesión exitoso",
        "access_token": access_token,
        "token_type": "bearer"
    }