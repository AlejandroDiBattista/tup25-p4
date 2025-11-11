from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from models.usuarios import Usuario
from db.database import engine
from utils.security import hash_password

router = APIRouter()

@router.post("/registrar")
def registrar_usuario(nombre: str, email: str, password: str):
    with Session(engine) as session:
        existe = session.exec(select(Usuario).where(Usuario.email == email)).first()
        if existe:
            raise HTTPException(status_code=400, detail="El email ya está registrado")
        usuario = Usuario(
            nombre=nombre,
            email=email,
            hashed_password=hash_password(password)
        )
        session.add(usuario)
        session.commit()
        return {"mensaje": "Usuario registrado correctamente"}