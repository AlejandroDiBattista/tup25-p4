from fastapi import APIRouter, HTTPException, Query
from sqlmodel import Session, select
from typing import Optional
from models import Producto, ProductoResponse
from database import engine

router = APIRouter(prefix="/productos", tags=["productos"])


@router.get("", response_model=list[ProductoResponse])
def listar_productos(
    categoria: Optional[str] = Query(None),
    buscar: Optional[str] = Query(None),
):
    with Session(engine) as session:
        statement = select(Producto)
        
        if categoria:
            statement = statement.where(Producto.categoria == categoria)
        
        if buscar:
            statement = statement.where(
                Producto.nombre.ilike(f"%{buscar}%") | 
                Producto.descripcion.ilike(f"%{buscar}%")
            )
        
        productos = session.exec(statement).all()
        return productos


@router.get("/{producto_id}", response_model=ProductoResponse)
def obtener_producto(producto_id: int):
    with Session(engine) as session:
        producto = session.get(Producto, producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return producto


@router.get("/categorias/todas", response_model=list[str])
def obtener_categorias():
    with Session(engine) as session:
        statement = select(Producto.categoria).distinct()
        categorias = session.exec(statement).all()
        return sorted(list(set(categorias)))
