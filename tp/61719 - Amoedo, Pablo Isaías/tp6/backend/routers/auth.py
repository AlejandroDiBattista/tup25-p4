from fastapi import APIRouter, HTTPException
from fastapi import Depends
from utils.security import obtener_usuario_actual
from sqlmodel import Session, select
from models.usuarios import Usuario
from db.database import engine
from utils.security import hash_password, verify_password, crear_token
from models.productos import Producto


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

@router.post("/login")
def login(email: str, password: str):
    with Session(engine) as session:
        usuario = session.exec(select(Usuario).where(Usuario.email == email)).first()
        if not usuario or not verify_password(password, usuario.hashed_password):
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        token = crear_token({"sub": usuario.email})
        return {"access_token": token, "token_type": "bearer"}
    

@router.get("/perfil")
def ver_perfil(email: str = Depends(obtener_usuario_actual)):
    with Session(engine) as session:
        usuario = session.exec(select(Usuario).where(Usuario.email == email)).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return {
            "nombre": usuario.nombre,
            "email": usuario.email
        }
    




