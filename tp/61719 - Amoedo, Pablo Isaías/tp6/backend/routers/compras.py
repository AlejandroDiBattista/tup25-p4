from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from db.database import engine
from models.compras import Compra
from routers.auth import obtener_usuario_actual

router = APIRouter()

@router.get("/compras")
def ver_historial(usuario_email: str = Depends(obtener_usuario_actual)):
    with Session(engine) as session:
        compras = session.exec(
            select(Compra).where(Compra.usuario_email == usuario_email)
        ).all()

        return {"historial": compras}
