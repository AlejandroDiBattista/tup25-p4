# backend/routers/products.py
from fastapi import APIRouter, HTTPException
import crud
from typing import List
from schemas import ProductoOut

router = APIRouter(prefix="/productos", tags=["productos"])

@router.get("", response_model=List[ProductoOut])
def listar(q: str = None, categoria: str = None):
    prods = crud.listar_productos(q=q, categoria=categoria)
    return prods

@router.get("/{product_id}", response_model=ProductoOut)
def detalle(product_id: int):
    p = crud.obtener_producto(product_id)
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return p
