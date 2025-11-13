from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app import models, schemas
from app.database import get_session

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("/", response_model=list[schemas.ProductoOut])
def listar_productos(categoria: Optional[str] = None, buscar: Optional[str] = None, db: Session = Depends(get_session)):
    query = db.query(models.Producto)
    if categoria:
        query = query.filter(models.Producto.categoria.ilike(f"%{categoria}%"))
    if buscar:
        query = query.filter(models.Producto.nombre.ilike(f"%{buscar}%"))
    return query.all()

@router.get("/{id}", response_model=schemas.ProductoOut)
def obtener_producto(id: int, db: Session = Depends(get_session)):
    producto = db.query(models.Producto).get(id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto