from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_session
from app.schemas.usuario import UsuarioCreate, UsuarioPublic
from app.services.auth import EmailAlreadyRegisteredError, register_user

router = APIRouter(tags=["Autenticación"])


@router.post("/registrar", response_model=UsuarioPublic, status_code=status.HTTP_201_CREATED)
def registrar_usuario(payload: UsuarioCreate, session: Session = Depends(get_session)) -> UsuarioPublic:
    try:
        usuario = register_user(session, payload.nombre, payload.email, payload.password)
    except EmailAlreadyRegisteredError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))
    return usuario
