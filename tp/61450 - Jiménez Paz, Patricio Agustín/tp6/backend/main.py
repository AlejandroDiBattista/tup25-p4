from fastapi import FastAPI, HTTPException, Depends, status, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
import json
from pathlib import Path
from datetime import datetime, timedelta
from models import Producto, Usuario
from schemas import UsuarioRegistro, UsuarioLogin
from auth import hash_password, verify_password, generar_token, obtener_usuario_actual, verificar_no_autenticado
from database import get_session, inicializar_tablas, engine

app = FastAPI(title="API Productos")

app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def inicializar_base_datos():
    inicializar_tablas()
    
    with Session(engine) as session:
        resultado = session.exec(select(Producto)).first()
        if not resultado:
            ruta_productos = Path(__file__).parent / "productos.json"
            with open(ruta_productos, "r", encoding="utf-8") as archivo:
                productos_data = json.load(archivo)
            
            for producto_data in productos_data:
                producto = Producto(**producto_data)
                session.add(producto)
            
            session.commit()

@app.on_event("startup")
def on_startup():
    inicializar_base_datos()

@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}

@app.post("/registrar", status_code=status.HTTP_201_CREATED)
def registrar_usuario(
    usuario_data: UsuarioRegistro,
    session: Session = Depends(get_session),
    _: bool = Depends(verificar_no_autenticado)
):
    usuario_existente = session.exec(
        select(Usuario).where(Usuario.email == usuario_data.email)
    ).first()
    
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    nuevo_usuario = Usuario(
        nombre=usuario_data.nombre,
        email=usuario_data.email,
        password=hash_password(usuario_data.password)
    )
    
    session.add(nuevo_usuario)
    session.commit()
    session.refresh(nuevo_usuario)
    
    return {"mensaje": "Usuario registrado exitosamente", "email": nuevo_usuario.email}


@app.post("/iniciar-sesion")
def iniciar_sesion(
    credenciales: UsuarioLogin,
    response: Response,
    session: Session = Depends(get_session),
    _: bool = Depends(verificar_no_autenticado)
):
    usuario = session.exec(
        select(Usuario).where(Usuario.email == credenciales.email)
    ).first()
    
    if not usuario or not verify_password(credenciales.password, usuario.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    usuario.token = generar_token()
    usuario.token_expiracion = (datetime.now() + timedelta(hours=1)).isoformat()
    
    session.add(usuario)
    session.commit()
    
    response.set_cookie(
        key="token",
        value=usuario.token,
        max_age=3600,
        httponly=True,
        samesite="lax"
    )
    
    return {"access_token": usuario.token, "token_type": "bearer"}


@app.post("/cerrar-sesion")
def cerrar_sesion(
    response: Response,
    usuario: Usuario = Depends(obtener_usuario_actual),
    session: Session = Depends(get_session)
):
    usuario.token = None
    usuario.token_expiracion = None
    session.add(usuario)
    session.commit()
    
    response.delete_cookie(key="token", samesite="lax")
    
    return {"mensaje": "Sesión cerrada exitosamente"}

@app.get("/productos")
def obtener_productos():
    with Session(engine) as session:
        productos = session.exec(select(Producto)).all()
        return productos

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
