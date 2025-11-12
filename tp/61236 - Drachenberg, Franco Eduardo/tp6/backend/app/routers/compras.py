from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.api.deps import get_current_user, get_session
from app.models import Usuario
from app.schemas.compra import CompraResumen
from app.services.compras import listar_compras

router = APIRouter(prefix="/compras", tags=["Compras"])


@router.get("", response_model=list[CompraResumen])
def listar_historial(
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_current_user),
) -> list[CompraResumen]:
    return listar_compras(session, usuario.id)
