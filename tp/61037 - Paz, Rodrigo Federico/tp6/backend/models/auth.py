from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from models.database import engine
from models.usuarios import Usuario

router = APIRouter()

@router.post("/registrar")
def registrar_usuario(usuario: Usuario):
    with Session(engine) as session:
       
        existente = session.exec(select(Usuario).where(Usuario.email == usuario.email)).first()
        if existente:
            raise HTTPException(status_code=400, detail="El correo ya está registrado")

        session.add(usuario)
        session.commit()
        session.refresh(usuario)
        return {"mensaje": "Usuario registrado correctamente", "usuario": usuario}


@router.post("/iniciar-sesion")
def iniciar_sesion(email: str, password: str):
    with Session(engine) as session:
        usuario = session.exec(select(Usuario).where(Usuario.email == email)).first()

        if not usuario or usuario.password != password:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")

        return {"mensaje": "Inicio de sesión exitoso", "usuario": usuario.nombre}