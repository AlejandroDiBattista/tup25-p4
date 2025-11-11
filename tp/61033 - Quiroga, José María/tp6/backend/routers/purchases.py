# backend/routers/purchases.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, Session
from database import get_engine
import auth
from models import Compra, CompraItem

router = APIRouter(prefix="/compras", tags=["compras"])

@router.get("")
def listar(current_user=Depends(auth.get_current_user)):
    engine = get_engine()
    with Session(engine) as session:
        compras = session.exec(select(Compra).where(Compra.usuario_id == current_user.id)).all()
        return compras

@router.get("/{compra_id}")
def detalle(compra_id: int, current_user=Depends(auth.get_current_user)):
    engine = get_engine()
    with Session(engine) as session:
        compra = session.get(Compra, compra_id)
        if not compra or compra.usuario_id != current_user.id:
            raise HTTPException(status_code=404, detail="Compra no encontrada")
        items = session.exec(select(CompraItem).where(CompraItem.compra_id == compra.id)).all()
        return {"compra": compra, "items": items}
