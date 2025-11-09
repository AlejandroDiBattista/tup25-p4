from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import json
import bcrypt
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from sqlmodel import SQLModel, create_engine, Session, select
from typing import List

from models.productos import (
    Producto, Usuario, Carrito, CarritoItem, Compra, CompraItem,
    UsuarioCreate, UsuarioRead, UsuarioLogin,
    Token, TokenData
)

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="iniciar-sesion")

DATABASE_FILE = "database.db"
DATABASE_URL = f"sqlite:///{DATABASE_FILE}"
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def cargar_datos_iniciales():
    with Session(engine) as session:
        producto_existente = session.exec(select(Producto)).first()
        if not producto_existente:
            print("Base de datos vacía, cargando productos iniciales...")
            ruta_productos = Path(__file__).parent / "productos.json"
            with open(ruta_productos, "r", encoding="utf-8") as archivo:
                datos = json.load(archivo)
                for item in datos:
                    producto_nuevo = Producto(
                        id=item.get("id"),
                        nombre=item["titulo"],
                        descripcion=item["descripcion"],
                        precio=item["precio"],
                        categoria=item["categoria"],
                        existencia=item["existencia"]
                    )
                    session.add(producto_nuevo)
                session.commit()
                print("Productos cargados exitosamente.")
        else:
            print("La base de datos ya tiene productos. No se cargan datos.")

def get_session():
    with Session(engine) as session:
        yield session

def hash_password(password: str) -> str:
    pw_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(pw_bytes, salt)
    return hashed_pw.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(
    session: Session = Depends(get_session),
    token: str = Depends(oauth2_scheme)
) -> Usuario:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception

        token_data = TokenData(email=email)

    except JWTError:
        raise credentials_exception

    db_usuario = session.exec(
        select(Usuario).where(Usuario.email == token_data.email)
    ).first()

    if db_usuario is None:
        raise credentials_exception

    return db_usuario

app = FastAPI(title="API TP6 - E-Commerce")
@app.on_event("startup")
def on_startup():
    print("Iniciando aplicación...")
    create_db_and_tables()
    cargar_datos_iniciales()
    print("Aplicación lista.")
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def root():
    return {"mensaje": "API de E-Commerce - use /docs para ver la documentación"}

@app.get("/productos", response_model=List[Producto])
def obtener_productos(session: Session = Depends(get_session)):
    productos = session.exec(select(Producto)).all()
    return productos

@app.post("/registrar", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
def registrar_usuario(usuario_data: UsuarioCreate, session: Session = Depends(get_session)):
    usuario_existente = session.exec(
        select(Usuario).where(Usuario.email == usuario_data.email)
    ).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo electrónico ya está registrado."
        )
    hashed_contrasena = hash_password(usuario_data.password)
    db_usuario = Usuario(
        nombre=usuario_data.nombre,
        email=usuario_data.email,
        contrasena=hashed_contrasena
    )
    session.add(db_usuario)
    session.commit()
    session.refresh(db_usuario)
    return db_usuario

@app.post("/iniciar-sesion", response_model=Token)
def iniciar_sesion(
    usuario_login: UsuarioLogin,
    session: Session = Depends(get_session)
):
    db_usuario = session.exec(
        select(Usuario).where(Usuario.email == usuario_login.email)
    ).first()

    if not db_usuario or not verify_password(usuario_login.password, db_usuario.contrasena):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo electrónico o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_usuario.email},
        expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")

@app.post("/cerrar-sesion")
def cerrar_sesion(
    usuario_actual: Usuario = Depends(get_current_user)
):
    print(f"Usuario {usuario_actual.email} cerrando sesión.")
    return {"mensaje": f"Sesión cerrada para {usuario_actual.email}. Adios!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)