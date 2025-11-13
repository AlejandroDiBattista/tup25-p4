from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, utils
from app.database import get_session

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/registrar")
def registrar(usuario: schemas.UserCreate, db: Session = Depends(get_session)):
    existe = db.query(models.User).filter(models.User.email == usuario.email).first()
    if existe:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    nuevo = models.User(
        nombre=usuario.nombre,
        email=usuario.email,
        password=utils.hash_password(usuario.password)
    )
    db.add(nuevo)
    db.commit()
    return {"message": "Usuario registrado correctamente"}

@router.post("/iniciar-sesion")
def iniciar_sesion(usuario: schemas.UserLogin, db: Session = Depends(get_session)):
    db_user = db.query(models.User).filter(models.User.email == usuario.email).first()
    if not db_user or not utils.verify_password(usuario.password, db_user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    token = utils.create_token({"sub": db_user.email})
    return {"token": token}

@router.post("/cerrar-sesion")
def cerrar_sesion():
    return {"message": "Sesión cerrada (token invalidado en cliente)"}