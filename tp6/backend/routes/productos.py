from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import List, Optional

from models import Producto
from schemas.schemas import ProductoCreate, ProductoResponse
from database import get_session

router = APIRouter(prefix="/api/productos", tags=["productos"])


@router.get("", response_model=List[ProductoResponse])
def get_productos(
    session: Session = Depends(get_session),
    categoria: Optional[str] = Query(None, description="Filtrar por categoría"),
    busqueda: Optional[str] = Query(None, description="Buscar por nombre o descripción")
):
    """Obtiene lista de productos con filtros opcionales"""
    query = select(Producto)
    
    if categoria:
        query = query.where(Producto.categoria == categoria)
    
    if busqueda:
        busqueda_lower = busqueda.lower()
        query = query.where(
            (Producto.nombre.ilike(f"%{busqueda_lower}%")) |
            (Producto.descripcion.ilike(f"%{busqueda_lower}%"))
        )
    
    productos = session.exec(query).all()
    return productos


@router.get("/{producto_id}", response_model=ProductoResponse)
def get_producto(
    producto_id: int,
    session: Session = Depends(get_session)
):
    """Obtiene detalles de un producto específico"""
    producto = session.exec(
        select(Producto).where(Producto.id == producto_id)
    ).first()
    
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    return producto


@router.post("", response_model=ProductoResponse, status_code=status.HTTP_201_CREATED)
def crear_producto(
    producto_data: ProductoCreate,
    session: Session = Depends(get_session)
):
    """Crea un nuevo producto (solo para administradores)"""
    nuevo_producto = Producto(**producto_data.model_dump())
    session.add(nuevo_producto)
    session.commit()
    session.refresh(nuevo_producto)
    return nuevo_producto
