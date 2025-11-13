from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlmodel import Session, select
from typing import List, Optional

from models import Usuario, Compra
from schemas.schemas import CompraResponse
from database import get_session
from utils import get_current_user

router = APIRouter(prefix="/api/compras", tags=["compras"])


@router.get("", response_model=List[CompraResponse])
def get_compras(
    authorization: Optional[str] = Header(None),
    session: Session = Depends(get_session)
):
    """Obtiene el resumen de compras del usuario"""
    usuario = get_current_user(authorization, session)
    
    compras = session.exec(
        select(Compra).where(Compra.usuario_id == usuario.id).order_by(Compra.fecha.desc())
    ).all()
    
    return compras


@router.get("/{compra_id}", response_model=CompraResponse)
def get_compra(
    compra_id: int,
    authorization: Optional[str] = Header(None),
    session: Session = Depends(get_session)
):
    """Obtiene detalles de una compra específica"""
    usuario = get_current_user(authorization, session)
    
    compra = session.exec(
        select(Compra).where(
            (Compra.id == compra_id) & (Compra.usuario_id == usuario.id)
        )
    ).first()
    
    if not compra:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compra no encontrada"
        )
    
    return compra
