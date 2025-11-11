# backend/routers/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
import crud, auth
from schemas import UsuarioCreate, Token
from database import get_engine

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/registrar")
def registrar(u: UsuarioCreate):
    existing = crud.obtener_usuario_por_email(u.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    user = crud.crear_usuario(u.nombre, u.email, u.password)
    return {"id": user.id, "email": user.email}

@router.post("/iniciar-sesion", response_model=Token)
def iniciar_sesion(form: UsuarioCreate):
    user = crud.obtener_usuario_por_email(form.email)
    if not user or not auth.verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = auth.create_access_token({"sub": str(user.id)})
    return {"access_token": token}
