from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
import json
from pathlib import Path
from typing import List, Optional, Annotated
from sqlmodel import SQLModel, Session, select
from datetime import timedelta

from database import engine, get_session
from models.models import Producto, ProductoRead, Usuario, UsuarioCreate, UsuarioRead
from auth.schemas import Token
from auth.security import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, get_password_hash, verify_password, get_current_user

app = FastAPI(title="API Productos")

app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def populate_database():
    ruta_productos = Path(__file__).parent / "productos.json"
    with Session(engine) as session:
        if not session.exec(select(Producto)).first():
            print("Cargando productos iniciales en la base de datos...")
            with open(ruta_productos, "r", encoding="utf-8") as archivo:
                productos_json = json.load(archivo)
                for prod_data in productos_json:
                    producto = Producto.model_validate(prod_data)
                    session.add(producto)
            session.commit()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    populate_database()

@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}

# --- Endpoints de Autenticación ---

@app.post("/registrar", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED, tags=["Usuarios"])
def registrar_usuario(usuario_create: UsuarioCreate, session: Session = Depends(get_session)):
    usuario_existente = session.exec(select(Usuario).where(Usuario.email == usuario_create.email)).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado.",
        )

    hashed_password = get_password_hash(usuario_create.password)
    
    usuario_data = usuario_create.model_dump()
    usuario_data.pop("password", None)
    usuario_data["password_hash"] = hashed_password

    usuario = Usuario(**usuario_data)
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    
    return usuario

@app.post("/iniciar-sesion", response_model=Token, tags=["Usuarios"])
def iniciar_sesion(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    usuario = session.exec(select(Usuario).where(Usuario.email == form_data.username)).first()
    if not usuario or not verify_password(form_data.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrecto",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": usuario.email}, expires_delta=access_token_expires)
    
    return Token(access_token=access_token, token_type="bearer")

@app.get("/usuarios/me", response_model=UsuarioRead, tags=["Usuarios"])
def leer_usuario_actual(current_user: Annotated[Usuario, Depends(get_current_user)]):
    """Obtiene el perfil del usuario actualmente autenticado."""
    return current_user

# --- Endpoints de Productos ---

@app.get("/productos", response_model=List[ProductoRead], tags=["Productos"], summary="Obtener lista de productos")
def obtener_productos(session: Session = Depends(get_session), q: Optional[str] = None, categoria: Optional[str] = None):
    query = select(Producto)
    if q:
        query = query.where(Producto.titulo.contains(q))
    if categoria:
        query = query.where(Producto.categoria == categoria)
    
    productos = session.exec(query).all()
    return productos

@app.get("/productos/{id}", response_model=ProductoRead, tags=["Productos"], summary="Obtener un producto por ID")
def obtener_producto(id: int, session: Session = Depends(get_session)):
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return producto
