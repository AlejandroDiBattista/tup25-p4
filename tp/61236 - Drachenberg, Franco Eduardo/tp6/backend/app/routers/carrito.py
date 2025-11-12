from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.api.deps import get_current_user, get_session
from app.models import Usuario
from app.schemas.carrito import CarritoRead
from app.services.carrito import get_cart_summary

router = APIRouter(prefix="/carrito", tags=["Carrito"])


@router.get("", response_model=CarritoRead)
def obtener_carrito(
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_current_user),
) -> CarritoRead:
    return get_cart_summary(session, usuario.id)
