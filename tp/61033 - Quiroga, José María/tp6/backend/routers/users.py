from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from db import get_session
from core_models import User
from auth import get_password_hash, verify_password, create_access_token, revoke_token, oauth2_scheme
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(tags=["Usuarios"]) 


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
def logout(token: str = Depends(oauth2_scheme)):
    """Cerrar sesión: revoca el token JWT recibido en el header Authorization: Bearer <token>"""
    revoke_token(token)
    return {"ok": True}

