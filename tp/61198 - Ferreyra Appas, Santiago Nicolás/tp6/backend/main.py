from datetime import datetime
from typing import List, Tuple

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from . import schemas
from .auth import (
    generar_token,
    get_cliente_actual,
    hash_password,
    invalidar_token,
    verificar_password,
)
from .database import crear_bd_y_tablas, get_session, engine
from .models import Articulo, CarritoCompra, Cliente, LineaCarrito, LineaOrden, Orden
from .seed_data import cargar_productos_iniciales

app = FastAPI(title="TP6 - Campus Market")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============
# AUTENTICACIÓN
# ============

@app.post("/registrar", response_model=schemas.ClientePublico)
def registrar_usuario(
    datos: schemas.RegistroCliente, session: Session = Depends(get_session)
):
    existe = session.exec(
        select(Cliente).where(Cliente.correo == datos.correo)
    ).first()
    if existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado",
        )

    nuevo = Cliente(
        nombre=datos.nombre,
        correo=datos.correo,
        hash_password=hash_password(datos.password),
    )
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return schemas.ClientePublico(id=nuevo.id, nombre=nuevo.nombre, correo=nuevo.correo)


@app.post("/iniciar-sesion", response_model=schemas.TokenRespuesta)
def iniciar_sesion(
    datos: schemas.LoginCliente, session: Session = Depends(get_session)
):
    usuario = session.exec(
        select(Cliente).where(Cliente.correo == datos.correo)
    ).first()
    if not usuario or not verificar_password(datos.password, usuario.hash_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
        )
    token = generar_token(usuario.id)
    return schemas.TokenRespuesta(
        access_token=token,
        usuario_nombre=usuario.nombre,
    )


@app.post("/cerrar-sesion")
def cerrar_sesion():
    # implementación simple, el cliente sólo descarta el token
    return {"ok": True}