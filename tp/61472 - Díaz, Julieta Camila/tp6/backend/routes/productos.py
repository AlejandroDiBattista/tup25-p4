from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Producto, ProductoRead

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("/", response_model=List[ProductoRead])
async def get_productos(
    session: Session = Depends(get_session),
    busqueda: Optional[str] = None,
    categoria: Optional[str] = None
):
    stmt = select(Producto)

    if categoria:
        stmt = stmt.where(Producto.categoria == categoria)

    if busqueda:
        pattern = f"%{busqueda.lower()}%"
        stmt = stmt.where(
            (Producto.nombre.ilike(pattern)) |
            (Producto.descripcion.ilike(pattern))
        )

    productos = session.exec(stmt).all()
    return productos


@router.get("/{id}", response_model=ProductoRead)
async def get_producto(id: int, session: Session = Depends(get_session)):
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto