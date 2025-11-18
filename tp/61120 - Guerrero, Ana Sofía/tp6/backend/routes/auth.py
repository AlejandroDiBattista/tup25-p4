from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import timedelta

from models import Usuario
from schemas.schemas import UsuarioCreate, UsuarioResponse, LoginRequest, TokenResponse
from database import get_session
from security import hash_password, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/api", tags=["autenticación"])


@router.post("/registrar", response_model=UsuarioResponse)
def registrar_usuario(
    usuario_data: UsuarioCreate,
    session: Session = Depends(get_session)
):
    """Registra un nuevo usuario"""
    # Verificar si el email ya existe
    usuario_existente = session.exec(
        select(Usuario).where(Usuario.email == usuario_data.email)
    ).first()
    
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # Crear nuevo usuario con contraseña hasheada
    nuevo_usuario = Usuario(
        nombre=usuario_data.nombre,
        email=usuario_data.email,
        contraseña=hash_password(usuario_data.contraseña)
    )
    
    session.add(nuevo_usuario)
    session.commit()
    session.refresh(nuevo_usuario)
    
    return nuevo_usuario


@router.post("/iniciar-sesion", response_model=TokenResponse)
def iniciar_sesion(
    login_data: LoginRequest,
    session: Session = Depends(get_session)
):
    """Inicia sesión y devuelve un token JWT"""
    # Buscar usuario por email
    usuario = session.exec(
        select(Usuario).where(Usuario.email == login_data.email)
    ).first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    # Verificar contraseña
    if not verify_password(login_data.contraseña, usuario.contraseña):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    # Crear token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(usuario.id), "email": usuario.email},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "usuario": usuario
    }


@router.post("/cerrar-sesion")
def cerrar_sesion():
    """Cierra sesión (invalidar token en el frontend)"""
    return {"mensaje": "Sesión cerrada exitosamente"}
