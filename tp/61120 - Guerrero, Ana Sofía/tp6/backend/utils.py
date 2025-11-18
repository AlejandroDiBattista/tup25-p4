from fastapi import HTTPException, status, Depends
from sqlmodel import Session, select
from models import Usuario
from database import get_session
from security import decode_token

def get_current_user(
    token: str = None,
    session: Session = Depends(get_session)
) -> Usuario:
    """Obtiene el usuario actual desde el token JWT"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado"
        )
    
    # Remover "Bearer " del token si existe
    if token.startswith("Bearer "):
        token = token[7:]
    
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    
    usuario_id = payload.get("sub")
    if not usuario_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    
    usuario = session.exec(
        select(Usuario).where(Usuario.id == int(usuario_id))
    ).first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado"
        )
    
    return usuario
