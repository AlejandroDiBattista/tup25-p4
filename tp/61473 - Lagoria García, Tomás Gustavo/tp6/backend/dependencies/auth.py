"""
Dependencias de autenticación para proteger endpoints.

Basado en las prácticas de clase (24.login/login.py y 21.agenda-front-back)
"""
from fastapi import Depends, HTTPException, status, Cookie
from sqlmodel import Session, select
from typing import Annotated, Optional

from database import get_session
from models import Usuario
from utils.security import token_vigente


# ==================== FUNCIONES AUXILIARES ====================

def buscar_usuario_por_token(token: str, session: Session) -> Optional[Usuario]:
    """
    Busca un usuario por su token de autenticación.
    
    Args:
        token: Token de autenticación
        session: Sesión de base de datos
        
    Returns:
        Usuario si se encuentra y el token es válido, None en caso contrario
    """
    cmd = select(Usuario).where(Usuario.token == token)
    usuario = session.exec(cmd).first()
    
    if usuario and usuario.token_expiration:
        if token_vigente(usuario.token_expiration):
            return usuario
    
    return None


def buscar_usuario_por_email(email: str, session: Session) -> Optional[Usuario]:
    """
    Busca un usuario por su email.
    
    Args:
        email: Email del usuario
        session: Sesión de base de datos
        
    Returns:
        Usuario si existe, None en caso contrario
    """
    cmd = select(Usuario).where(Usuario.email == email)
    return session.exec(cmd).first()


# ==================== DEPENDENCIAS ====================

def get_usuario_actual(
    token: Annotated[str | None, Cookie()] = None,
    session: Session = Depends(get_session)
) -> Usuario:
    """
    Dependencia que obtiene el usuario autenticado desde el token en cookie.
    
    Lanza HTTPException 401 si:
    - No hay token
    - Token inválido
    - Token expirado
    - Usuario no encontrado
    - Usuario inactivo
    
    Uso:
        @app.get("/perfil")
        def get_perfil(usuario: Usuario = Depends(get_usuario_actual)):
            return {"nombre": usuario.nombre, "email": usuario.email}
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No hay sesión activa. Por favor inicie sesión."
        )
    
    # Buscar usuario por token
    usuario = buscar_usuario_por_token(token, session)
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o sesión expirada."
        )
    
    # Verificar que el usuario esté activo
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo. Contacte al administrador."
        )
    
    return usuario


def get_usuario_opcional(
    token: Annotated[str | None, Cookie()] = None,
    session: Session = Depends(get_session)
) -> Optional[Usuario]:
    """
    Dependencia que obtiene el usuario si está autenticado, sino None.
    
    Útil para endpoints que funcionan con y sin autenticación.
    No lanza excepciones.
    
    Uso:
        @app.get("/productos")
        def get_productos(usuario: Optional[Usuario] = Depends(get_usuario_opcional)):
            if usuario:
                # Mostrar productos personalizados
                pass
            else:
                # Mostrar productos públicos
                pass
    """
    if not token:
        return None
    
    try:
        return get_usuario_actual(token, session)
    except HTTPException:
        return None
