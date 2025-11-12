from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlmodel import Session, select

from app.api.deps import get_session
from app.models import Producto
from app.schemas.producto import ProductoRead

router = APIRouter(tags=["Productos"])


@router.get("/productos", response_model=list[ProductoRead])
def listar_productos(
    categoria: Optional[str] = Query(default=None, description="Filtrar por categoría exacta"),
    buscar: Optional[str] = Query(default=None, description="Buscar en nombre y descripción"),
    session: Session = Depends(get_session),
) -> list[ProductoRead]:
    statement = select(Producto)

    if categoria:
        statement = statement.where(func.lower(Producto.categoria) == categoria.lower())

    if buscar:
        like_pattern = f"%{buscar.lower()}%"
        statement = statement.where(
            or_(
                func.lower(Producto.nombre).like(like_pattern),
                func.lower(Producto.descripcion).like(like_pattern),
            )
        )

    statement = statement.order_by(Producto.nombre)
    productos = session.exec(statement).all()
    return productos


@router.get("/productos/{producto_id}", response_model=ProductoRead)
def obtener_producto(producto_id: int, session: Session = Depends(get_session)) -> ProductoRead:
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return producto

