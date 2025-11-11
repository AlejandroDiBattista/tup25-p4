from fastapi import APIRouter
from sqlmodel import Session, select
from db.database import engine
from models.productos import Producto

router = APIRouter()

@router.get("/productos")
def listar_productos():
    with Session(engine) as session:
        productos = session.exec(select(Producto)).all()
        return productos