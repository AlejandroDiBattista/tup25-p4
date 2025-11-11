from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from db import get_session
from core_models import User
from auth import get_password_hash, verify_password, create_access_token, revoke_token
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()


class RegisterSchema(BaseModel):
    nombre: str
    email: str
    password: str


@router.post("/registrar")
def registrar(data: RegisterSchema, session: Session = Depends(get_session)):
    # check existing email
    stmt = select(User).where(User.email == data.email)
    if session.exec(stmt).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(nombre=data.nombre, email=data.email, hashed_password=get_password_hash(data.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"id": user.id, "nombre": user.nombre, "email": user.email}


@router.post("/iniciar-sesion")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    stmt = select(User).where(User.email == form_data.username)
    user = session.exec(stmt).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/cerrar-sesion")
def logout(token: str = Depends(OAuth2PasswordRequestForm), session: Session = Depends(get_session)):
    # Simpler: expect token in form password field? For demo we accept form but in practice use Authorization header
    # Instead accept a bearer token string in 'password' field of form to revoke
    t = token.password
    revoke_token(t)
    return {"ok": True}
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Usuarios"])

class LoginRequest(BaseModel):
    username: str
    password: str

fake_users_db = {
    "admin": {"username": "admin", "password": "1234"},
    "user": {"username": "user", "password": "abcd"},
}

@router.post("/iniciar-sesion")
def login(data: LoginRequest):
    user = fake_users_db.get(data.username)
    if not user or user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    return {"mensaje": "Inicio de sesión exitoso", "usuario": data.username}
