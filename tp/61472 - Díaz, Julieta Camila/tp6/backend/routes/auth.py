from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from database import get_session
from models import Usuario, UsuarioCreate, UsuarioRead, Token, LoginData
from security import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES
) 

router = APIRouter(tags=["Autenticación"])

# ----------------------------------
# POST /registrar
# ----------------------------------
@router.post("/registrar", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UsuarioCreate, 
    session: Session = Depends(get_session)
):
    # 1. Verificar si el email ya existe
    existing_user = session.exec(select(Usuario).where(Usuario.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado."
        )

    # 2. Hashear la contraseña
    hashed_password = get_password_hash(user_data.password)

    # 3. Crear el nuevo usuario
    new_user = Usuario(
        nombre=user_data.nombre,
        email=user_data.email,
        hashed_password=hashed_password 
    )

    # 4. Guardar en la base de datos
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user

# ----------------------------------
# POST /iniciar-sesion
# ----------------------------------
@router.post("/iniciar-sesion", response_model=Token)
async def login_user(
    form_data: LoginData, # Recibe email y password
    session: Session = Depends(get_session)
):
    # 1. Buscar usuario por email
    user = session.exec(select(Usuario).where(Usuario.email == form_data.email)).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas (Usuario no encontrado)"
        )
    
    # 2. Verificar contraseña
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas (Contraseña inválida)"
        )

    # 3. Generar token JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    access_token = create_access_token(
        data={"email": user.email}, # Usamos el email como identificador (sub)
        expires_delta=access_token_expires
    )

    # 4. Devolver el token
    return {"access_token": access_token, "token_type": "bearer"}