from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_session

router = APIRouter(prefix="/compras", tags=["Compras"])

# 🔹 Ver historial de compras
@router.get("/", response_model=list[schemas.CompraOut])
def listar_compras(db: Session = Depends(get_session)):
    compras = db.query(models.Compra).all()
    return compras

# 🔹 Ver detalle de una compra específica
@router.get("/{id}", response_model=schemas.CompraOut)
def detalle_compra(id: int, db: Session = Depends(get_session)):
    compra = db.query(models.Compra).get(id)
    if not compra:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    return compra