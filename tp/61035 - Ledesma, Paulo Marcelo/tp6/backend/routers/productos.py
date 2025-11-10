from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session, select
from typing import Optional, List

from db import get_session
from models.producto import Producto

router = APIRouter()

@router.get("/productos", response_model=List[Producto])
def listar_productos(
    categoria: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    session: Session = Depends(get_session)
):
    """
    Obtener productos con filtros opcionales:
    - categoria=electro, ropa, etc
    - q=texto para buscar en nombre o descripción
    """

    query = select(Producto)

    if categoria:
        query = query.where(Producto.categoria.contains(categoria))

    if q:
        texto = f"%{q}%"
        query = query.where(
            (Producto.nombre.contains(q)) |
            (Producto.descripcion.contains(q))
        )

    productos = session.exec(query).all()
    return productos


@router.get("/productos/{producto_id}", response_model=Producto)
def obtener_producto(producto_id: int, session: Session = Depends(get_session)):
    """
    Obtener detalle de un producto por ID.
    """
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    return producto