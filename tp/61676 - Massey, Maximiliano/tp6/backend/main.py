from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, SQLModel, create_engine
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional
import json
from pathlib import Path

from models import Usuario, Carrito, CarritoItem, Compra, CompraItem

# Configuración de la base de datos
DATABASE_URL = "sqlite:///./tienda.db"
engine = create_engine(DATABASE_URL)

# Configuración de JWT
SECRET_KEY = "tu_clave_secreta_aqui"  # En producción usar variable de entorno
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configuración de password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuración de OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Configuración de la aplicación
app = FastAPI(title="API Productos")

# Configuración de JWT
SECRET_KEY = "tu_clave_secreta_aqui"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configuración de password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuración de OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    with Session(engine) as session:
        yield session

def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Usuario:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if usuario is None:
        raise credentials_exception
    return usuario

# Montar directorio de imágenes como archivos estáticos
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar productos desde el archivo JSON
def cargar_productos():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

@app.post("/registrar")
async def registrar_usuario(
    nombre: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    # Verificar si el usuario ya existe
    usuario_existe = db.query(Usuario).filter(Usuario.email == email).first()
    if usuario_existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # Crear nuevo usuario
    usuario = Usuario(
        nombre=nombre,
        email=email,
        password_hash=get_password_hash(password)
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    
    return {"mensaje": "Usuario registrado exitosamente"}

@app.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    if not verify_password(form_data.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": usuario.email},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email
        }
    }

@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}

@app.get("/productos")
async def obtener_productos(search: str = None, categoria: str = None):
    productos = cargar_productos()
    
    # Filtrar por búsqueda
    if search:
        search = search.lower()
        productos = [p for p in productos if search in p["nombre"].lower() or search in p["descripcion"].lower()]
    
    # Filtrar por categoría
    if categoria:
        productos = [p for p in productos if p["categoria"].lower() == categoria.lower()]
    
    return productos

@app.get("/carrito")
async def obtener_carrito(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    carrito = db.query(Carrito).filter(
        Carrito.usuario_id == current_user.id,
        Carrito.estado == "activo"
    ).first()
    
    if not carrito:
        carrito = Carrito(usuario_id=current_user.id, estado="activo")
        db.add(carrito)
        db.commit()
        db.refresh(carrito)
    
    return carrito

@app.post("/carrito/agregar/{producto_id}")
async def agregar_al_carrito(
    producto_id: int,
    cantidad: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar existencia del producto
    productos = cargar_productos()
    producto = next((p for p in productos if p["id"] == producto_id), None)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    if producto["existencia"] < cantidad:
        raise HTTPException(status_code=400, detail="No hay suficiente stock")
    
    # Obtener o crear carrito
    carrito = db.query(Carrito).filter(
        Carrito.usuario_id == current_user.id,
        Carrito.estado == "activo"
    ).first()
    
    if not carrito:
        carrito = Carrito(usuario_id=current_user.id, estado="activo")
        db.add(carrito)
        db.commit()
    
    # Agregar item al carrito
    item = CarritoItem(
        carrito_id=carrito.id,
        producto_id=producto_id,
        cantidad=cantidad
    )
    db.add(item)
    db.commit()
    
    return {"mensaje": "Producto agregado al carrito"}

@app.delete("/carrito/quitar/{producto_id}")
async def quitar_del_carrito(
    producto_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    carrito = db.query(Carrito).filter(
        Carrito.usuario_id == current_user.id,
        Carrito.estado == "activo"
    ).first()
    
    if not carrito:
        raise HTTPException(status_code=404, detail="Carrito no encontrado")
    
    db.query(CarritoItem).filter(
        CarritoItem.carrito_id == carrito.id,
        CarritoItem.producto_id == producto_id
    ).delete()
    
    db.commit()
    return {"mensaje": "Producto eliminado del carrito"}

@app.post("/carrito/finalizar")
async def finalizar_compra(
    direccion: str,
    tarjeta: str,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Obtener carrito activo
    carrito = db.query(Carrito).filter(
        Carrito.usuario_id == current_user.id,
        Carrito.estado == "activo"
    ).first()
    
    if not carrito or not carrito.items:
        raise HTTPException(status_code=400, detail="Carrito vacío")
    
    # Validar stock
    productos = cargar_productos()
    for item in carrito.items:
        producto = next((p for p in productos if p["id"] == item.producto_id), None)
        if not producto or producto["existencia"] < item.cantidad:
            raise HTTPException(status_code=400, detail=f"Stock insuficiente para {producto['nombre']}")
    
    # Calcular totales
    subtotal = sum(item.cantidad * next(p["precio"] for p in productos if p["id"] == item.producto_id)
                  for item in carrito.items)
    
    # Aplicar IVA según categoría
    iva_total = 0
    for item in carrito.items:
        producto = next(p for p in productos if p["id"] == item.producto_id)
        iva_tasa = 0.10 if producto["categoria"] == "electronicos" else 0.21
        iva_total += item.cantidad * producto["precio"] * iva_tasa
    
    # Calcular envío
    envio = 0 if subtotal > 1000 else 50
    total = subtotal + iva_total + envio
    
    # Crear compra
    compra = Compra(
        usuario_id=current_user.id,
        direccion=direccion,
        tarjeta=tarjeta[-4:],  # Guardar solo últimos 4 dígitos
        total=total,
        envio=envio
    )
    db.add(compra)
    
    # Crear items de compra
    for item in carrito.items:
        producto = next(p for p in productos if p["id"] == item.producto_id)
        compra_item = CompraItem(
            compra_id=compra.id,
            producto_id=item.producto_id,
            cantidad=item.cantidad,
            nombre=producto["nombre"],
            precio_unitario=producto["precio"]
        )
        db.add(compra_item)
    
    # Marcar carrito como completado
    carrito.estado = "completado"
    
    db.commit()
    
    return {"mensaje": "Compra finalizada exitosamente", "total": total}

@app.get("/compras")
async def obtener_compras(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    compras = db.query(Compra).filter(Compra.usuario_id == current_user.id).all()
    return compras

@app.get("/compras/{compra_id}")
async def obtener_compra(
    compra_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    compra = db.query(Compra).filter(
        Compra.id == compra_id,
        Compra.usuario_id == current_user.id
    ).first()
    
    if not compra:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    
    return compra

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
