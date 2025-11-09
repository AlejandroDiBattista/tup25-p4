from fastapi import APIRouter, Query
from sqlmodel import Session, select
from models.database import engine
from models.productos import Producto

router = APIRouter()

@router.get("/productos")
def listar_productos(q: str | None = Query(default=None), categoria: str | None = Query(default=None)):
    with Session(engine) as session:
        stmt = select(Producto)
        if q:
            q_like = f"%{q.lower()}%"
            stmt = stmt.where(
                (Producto.nombre.ilike(q_like)) |
                (Producto.descripcion.ilike(q_like))
            )
        if categoria and categoria.lower() != "todas":
            stmt = stmt.where(Producto.categoria == categoria)
        return session.exec(stmt).all()

@router.get("/productos/{id}")
def detalle_producto(id: int):
    with Session(engine) as session:
        p = session.get(Producto, id)
        if not p:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return p
