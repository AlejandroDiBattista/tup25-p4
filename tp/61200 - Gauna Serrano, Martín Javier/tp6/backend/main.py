from fastapi import FastAPI
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError
from typing import Optional, List
from pathlib import Path
import json
import os
from datetime import datetime, timedelta

# Ensure backend path is importable when main.py is loaded dynamically (tests may import by filepath)
BASE_DIR = Path(__file__).parent
import sys
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from db import engine, Base, get_session
import models_orm as models
import schemas

from sqlalchemy.orm import Session

app = FastAPI(title="API Comercio - TP6 (SQLAlchemy)")

# Static images
imagenes_dir = BASE_DIR / "imagenes"
if imagenes_dir.exists():
    app.mount("/imagenes", StaticFiles(directory=str(imagenes_dir)), name="imagenes")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth
SECRET_KEY = os.environ.get("SECRET_KEY", "cambiar-esto-por-uno-secreto")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/iniciar-sesion")

# In-memory token blacklist
token_blacklist = set()


def create_db_and_tables():
    Base.metadata.create_all(bind=engine)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def calculate_tax_and_subtotal(items: List[models.CartItem], session: Session):
    subtotal = 0.0
    iva = 0.0
    for item in items:
        product = session.get(models.Product, item.product_id)
        if not product:
            continue
        line = product.precio * item.cantidad
        subtotal += line
        tax_rate = 0.10 if (product.categoria or "").lower() == "electronica" else 0.21
        iva += line * tax_rate
    return round(subtotal, 2), round(iva, 2)


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_session)):
    if token in token_blacklist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalidado")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
        user_id = int(sub)
        user = db.get(models.User, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # load initial products if empty
    with next(get_session()) as db:
        any_prod = db.query(models.Product).first()
        if any_prod is None:
            ruta = BASE_DIR / "productos.json"
            if ruta.exists():
                with open(ruta, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for p in data:
                        prod = models.Product(
                            nombre=p.get("nombre"),
                            descripcion=p.get("descripcion"),
                            precio=float(p.get("precio", 0)),
                            categoria=p.get("categoria"),
                            existencia=int(p.get("existencia", 0)),
                            imagen=p.get("imagen"),
                        )
                        db.add(prod)
                    db.commit()


@app.get("/", tags=["salud"])
def root():
    return {"mensaje": "API Comercio - FastAPI + SQLAlchemy"}


from pydantic import BaseModel


class RegisterSchema(BaseModel):
    nombre: str
    email: str
    password: str


class LoginSchema(BaseModel):
    email: str
    password: str


class AddToCartSchema(BaseModel):
    product_id: int
    cantidad: int = 1


class FinalizeSchema(BaseModel):
    direccion: str
    tarjeta: str


@app.post("/registrar", status_code=201)
def registrar(payload: RegisterSchema, db: Session = Depends(get_session)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    user = models.User(nombre=payload.nombre, email=payload.email, hashed_password=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "email": user.email, "nombre": user.nombre}


@app.post("/iniciar-sesion")
def iniciar_sesion(payload: LoginSchema, db: Session = Depends(get_session)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    access_token = create_access_token({"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/cerrar-sesion")
def cerrar_sesion(request: Request, token: str = Depends(oauth2_scheme)):
    # Simplemente invalidar token en memoria
    token_blacklist.add(token)
    return {"ok": True}


@app.get("/productos")
def listar_productos(q: Optional[str] = None, categoria: Optional[str] = None, db: Session = Depends(get_session)):
    productos = db.query(models.Product).all()
    results = []
    for p in productos:
        if categoria and categoria.lower() not in (p.categoria or "").lower():
            continue
        if q and q.lower() not in ((p.nombre or "") + " " + (p.descripcion or "")).lower():
            continue
        results.append({
            "id": p.id,
            "nombre": p.nombre,
            "descripcion": p.descripcion,
            "precio": p.precio,
            "categoria": p.categoria,
            "existencia": p.existencia,
            "imagen": p.imagen,
            "agotado": p.existencia <= 0,
        })
    return results


@app.get("/productos/{producto_id}")
def producto_detalle(producto_id: int, db: Session = Depends(get_session)):
    p = db.get(models.Product, producto_id)
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return p


@app.post("/carrito", status_code=201)
def add_to_cart(payload: AddToCartSchema, user: models.User = Depends(get_current_user), db: Session = Depends(get_session)):
    product = db.get(models.Product, payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    if product.existencia < payload.cantidad:
        raise HTTPException(status_code=400, detail="No hay suficiente stock")
    # obtener o crear carrito abierto
    cart = db.query(models.Cart).filter(models.Cart.usuario_id == user.id, models.Cart.estado == "open").first()
    if not cart:
        cart = models.Cart(usuario_id=user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    # buscar item
    item = db.query(models.CartItem).filter(models.CartItem.cart_id == cart.id, models.CartItem.product_id == product.id).first()
    if item:
        item.cantidad += payload.cantidad
    else:
        item = models.CartItem(cart_id=cart.id, product_id=product.id, cantidad=payload.cantidad)
        db.add(item)
    db.commit()
    return {"ok": True}


@app.delete("/carrito/{product_id}")
def quitar_del_carrito(product_id: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_session)):
    cart = db.query(models.Cart).filter(models.Cart.usuario_id == user.id, models.Cart.estado == "open").first()
    if not cart:
        raise HTTPException(status_code=404, detail="Carrito no encontrado")
    item = db.query(models.CartItem).filter(models.CartItem.cart_id == cart.id, models.CartItem.product_id == product_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Producto no en el carrito")
    db.delete(item)
    db.commit()
    return {"ok": True}


@app.get("/carrito")
def ver_carrito(user: models.User = Depends(get_current_user), db: Session = Depends(get_session)):
    cart = db.query(models.Cart).filter(models.Cart.usuario_id == user.id, models.Cart.estado == "open").first()
    if not cart:
        return {"items": [], "subtotal": 0.0, "iva": 0.0, "envio": 0.0, "total": 0.0}
    items = db.query(models.CartItem).filter(models.CartItem.cart_id == cart.id).all()
    details = []
    for it in items:
        prod = db.get(models.Product, it.product_id)
        details.append({
            "product_id": it.product_id,
            "nombre": prod.nombre if prod else "",
            "precio": prod.precio if prod else 0.0,
            "cantidad": it.cantidad,
        })
    subtotal, iva = calculate_tax_and_subtotal(items, db)
    envio = 0.0 if subtotal > 1000 else 50.0
    total = round(subtotal + iva + envio, 2)
    return {"items": details, "subtotal": subtotal, "iva": iva, "envio": envio, "total": total}


@app.post("/carrito/finalizar")
def finalizar_compra(payload: FinalizeSchema, user: models.User = Depends(get_current_user), db: Session = Depends(get_session)):
    cart = db.query(models.Cart).filter(models.Cart.usuario_id == user.id, models.Cart.estado == "open").first()
    if not cart:
        raise HTTPException(status_code=400, detail="Carrito vacío")
    items = db.query(models.CartItem).filter(models.CartItem.cart_id == cart.id).all()
    if not items:
        raise HTTPException(status_code=400, detail="No hay items en el carrito")
    # Verificar stock nuevamente
    for it in items:
        prod = db.get(models.Product, it.product_id)
        if not prod or prod.existencia < it.cantidad:
            raise HTTPException(status_code=400, detail=f"Producto {prod.nombre if prod else it.product_id} sin stock suficiente")
    subtotal, iva = calculate_tax_and_subtotal(items, db)
    envio = 0.0 if subtotal > 1000 else 50.0
    total = round(subtotal + iva + envio, 2)
    # crear compra
    purchase = models.Purchase(usuario_id=user.id, direccion=payload.direccion, tarjeta=payload.tarjeta, total=total, envio=envio)
    db.add(purchase)
    db.commit()
    db.refresh(purchase)
    # crear items y decrementar stock
    for it in items:
        prod = db.get(models.Product, it.product_id)
        pi = models.PurchaseItem(purchase_id=purchase.id, producto_id=prod.id, cantidad=it.cantidad, nombre=prod.nombre, precio_unitario=prod.precio)
        db.add(pi)
        prod.existencia -= it.cantidad
        db.delete(it)
    cart.estado = "finalized"
    db.add(cart)
    db.commit()
    return {"ok": True, "purchase_id": purchase.id}


@app.post("/carrito/cancelar")
def cancelar_compra(user: models.User = Depends(get_current_user), db: Session = Depends(get_session)):
    cart = db.query(models.Cart).filter(models.Cart.usuario_id == user.id, models.Cart.estado == "open").first()
    if not cart:
        return {"ok": True}
    items = db.query(models.CartItem).filter(models.CartItem.cart_id == cart.id).all()
    for it in items:
        db.delete(it)
    db.commit()
    return {"ok": True}


@app.get("/compras")
def listar_compras(user: models.User = Depends(get_current_user), db: Session = Depends(get_session)):
    purchases = db.query(models.Purchase).filter(models.Purchase.usuario_id == user.id).all()
    return purchases


@app.get("/compras/{purchase_id}")
def detalle_compra(purchase_id: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_session)):
    purchase = db.get(models.Purchase, purchase_id)
    if not purchase or purchase.usuario_id != user.id:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    return purchase


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError
from typing import Optional, List
from pathlib import Path
import json
import os
from datetime import datetime, timedelta

# Ensure backend path is importable when main.py is loaded dynamically
BASE_DIR = Path(__file__).parent
import sys
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from db import engine, Base, get_session
import models_orm as models
import schemas

from sqlalchemy.orm import Session

app = FastAPI(title="API Comercio - TP6 (SQLAlchemy)")

# Static images
imagenes_dir = BASE_DIR / "imagenes"
if imagenes_dir.exists():
    app.mount("/imagenes", StaticFiles(directory=str(imagenes_dir)), name="imagenes")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth
SECRET_KEY = os.environ.get("SECRET_KEY", "cambiar-esto-por-uno-secreto")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/iniciar-sesion")

# In-memory token blacklist
token_blacklist = set()


def create_db_and_tables():
    Base.metadata.create_all(bind=engine)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def calculate_tax_and_subtotal(items: List[models.CartItem], session: Session):
    subtotal = 0.0
    iva = 0.0
    for item in items:
        product = session.get(models.Product, item.product_id)
        if not product:
            continue
        line = product.precio * item.cantidad
        subtotal += line
        tax_rate = 0.10 if product.categoria.lower() == "electronica" else 0.21
        iva += line * tax_rate
    return round(subtotal, 2), round(iva, 2)


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_session)):
    if token in token_blacklist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalidado")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
        user = db.get(models.User, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # load initial products if empty
    with next(get_session()) as db:
        any_prod = db.query(models.Product).first()
        if any_prod is None:
            ruta = BASE_DIR / "productos.json"
            if ruta.exists():
                with open(ruta, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for p in data:
                        prod = models.Product(
                            nombre=p.get("nombre"),
                            descripcion=p.get("descripcion"),
                            precio=float(p.get("precio", 0)),
                            categoria=p.get("categoria"),
                            existencia=int(p.get("existencia", 0)),
                            imagen=p.get("imagen"),
                        )
                        db.add(prod)
                    db.commit()


@app.get("/", tags=["salud"])
def root():
    return {"mensaje": "API Comercio - FastAPI + SQLAlchemy"}

from fastapi import FastAPI, HTTPException, Depends, status, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlmodel import SQLModel, create_engine, Session, select
from passlib.context import CryptContext
from jose import jwt, JWTError
from typing import Optional, List
from pathlib import Path
import json
import os
from datetime import datetime, timedelta

app = FastAPI(title="API Productos")
from models import (
    User,
    Product,
    Cart,
    CartItem,
    Purchase,
    PurchaseItem,
)

BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "database.db"

DATABASE_URL = f"sqlite:///{DB_PATH}"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Montar directorio de imágenes como archivos estáticos
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")
app = FastAPI(title="API Comercio - TP6")

# Configurar CORS
# Static images
imagenes_dir = BASE_DIR / "imagenes"
if imagenes_dir.exists():
    app.mount("/imagenes", StaticFiles(directory=str(imagenes_dir)), name="imagenes")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"] ,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar productos desde el archivo JSON
def cargar_productos():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)
# Auth
SECRET_KEY = os.environ.get("SECRET_KEY", "cambiar-esto-por-uno-secreto")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/iniciar-sesion")

# In-memory token blacklist (simple logout). For production persist this.
token_blacklist = set()


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


@app.get("/")
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def calculate_tax_and_subtotal(items: List[CartItem], session: Session):
    subtotal = 0.0
    iva = 0.0
    for item in items:
        product = session.get(Product, item.product_id)
        if not product:
            continue
        line = product.precio * item.cantidad
        subtotal += line
        tax_rate = 0.10 if product.categoria.lower() == "electronica" else 0.21
        iva += line * tax_rate
    return round(subtotal, 2), round(iva, 2)


class TokenData(BaseModel):
    user_id: Optional[int] = None


async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    if token in token_blacklist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalidado")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # Cargar productos desde productos.json si la tabla está vacía
    with Session(engine) as session:
        count = session.exec(select(Product)).first()
        if count is None:
            ruta = BASE_DIR / "productos.json"
            if ruta.exists():
                with open(ruta, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for p in data:
                        prod = Product(
                            nombre=p.get("nombre"),
                            descripcion=p.get("descripcion"),
                            precio=float(p.get("precio", 0)),
                            categoria=p.get("categoria"),
                            existencia=int(p.get("existencia", 0)),
                            imagen=p.get("imagen"),
                        )
                        session.add(prod)
                    session.commit()


### Schemas mínimos para requests
class RegisterSchema(BaseModel):
    nombre: str
    email: str
    password: str


class LoginSchema(BaseModel):
    email: str
    password: str


class AddToCartSchema(BaseModel):
    product_id: int
    cantidad: int = 1


class FinalizeSchema(BaseModel):
    direccion: str
    tarjeta: str


@app.get("/", tags=["salud"])
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}
    return {"mensaje": "API Comercio - FastAPI + SQLModel"}


@app.post("/registrar", status_code=201)
def registrar(payload: RegisterSchema, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    user = User(nombre=payload.nombre, email=payload.email, hashed_password=hash_password(payload.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"id": user.id, "email": user.email, "nombre": user.nombre}


@app.post("/iniciar-sesion")
def iniciar_sesion(payload: LoginSchema, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == payload.email)).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    access_token = create_access_token({"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/cerrar-sesion")
def cerrar_sesion(request: Request, token: str = Depends(oauth2_scheme)):
    # Simplemente invalidar token en memoria
    token_blacklist.add(token)
    return {"ok": True}


@app.get("/productos")
def obtener_productos():
    productos = cargar_productos()
    return productos
def listar_productos(q: Optional[str] = None, categoria: Optional[str] = None, session: Session = Depends(get_session)):
    stmt = select(Product)
    productos = session.exec(stmt).all()
    results = []
    for p in productos:
        if categoria and categoria.lower() not in (p.categoria or "").lower():
            continue
        if q and q.lower() not in (p.nombre + " " + (p.descripcion or "")).lower():
            continue
        results.append({
            "id": p.id,
            "nombre": p.nombre,
            "descripcion": p.descripcion,
            "precio": p.precio,
            "categoria": p.categoria,
            "existencia": p.existencia,
            "imagen": p.imagen,
            "agotado": p.existencia <= 0,
        })
    return results


@app.get("/productos/{producto_id}")
def producto_detalle(producto_id: int, session: Session = Depends(get_session)):
    p = session.get(Product, producto_id)
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return p


@app.post("/carrito", status_code=201)
def add_to_cart(payload: AddToCartSchema, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    product = session.get(Product, payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    if product.existencia < payload.cantidad:
        raise HTTPException(status_code=400, detail="No hay suficiente stock")
    # obtener o crear carrito abierto
    cart = session.exec(select(Cart).where(Cart.usuario_id == user.id, Cart.estado == "open")).first()
    if not cart:
        cart = Cart(usuario_id=user.id)
        session.add(cart)
        session.commit()
        session.refresh(cart)
    # buscar item
    item = session.exec(select(CartItem).where(CartItem.cart_id == cart.id, CartItem.product_id == product.id)).first()
    if item:
        item.cantidad += payload.cantidad
    else:
        item = CartItem(cart_id=cart.id, product_id=product.id, cantidad=payload.cantidad)
        session.add(item)
    session.commit()
    return {"ok": True}


@app.delete("/carrito/{product_id}")
def quitar_del_carrito(product_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    cart = session.exec(select(Cart).where(Cart.usuario_id == user.id, Cart.estado == "open")).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Carrito no encontrado")
    item = session.exec(select(CartItem).where(CartItem.cart_id == cart.id, CartItem.product_id == product_id)).first()
    if not item:
        raise HTTPException(status_code=404, detail="Producto no en el carrito")
    session.delete(item)
    session.commit()
    return {"ok": True}


@app.get("/carrito")
def ver_carrito(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    cart = session.exec(select(Cart).where(Cart.usuario_id == user.id, Cart.estado == "open")).first()
    if not cart:
        return {"items": [], "subtotal": 0.0, "iva": 0.0, "envio": 0.0, "total": 0.0}
    items = session.exec(select(CartItem).where(CartItem.cart_id == cart.id)).all()
    details = []
    for it in items:
        prod = session.get(Product, it.product_id)
        details.append({
            "product_id": it.product_id,
            "nombre": prod.nombre if prod else "",
            "precio": prod.precio if prod else 0.0,
            "cantidad": it.cantidad,
        })
    subtotal, iva = calculate_tax_and_subtotal(items, session)
    envio = 0.0 if subtotal > 1000 else 50.0
    total = round(subtotal + iva + envio, 2)
    return {"items": details, "subtotal": subtotal, "iva": iva, "envio": envio, "total": total}


@app.post("/carrito/finalizar")
def finalizar_compra(payload: FinalizeSchema, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    cart = session.exec(select(Cart).where(Cart.usuario_id == user.id, Cart.estado == "open")).first()
    if not cart:
        raise HTTPException(status_code=400, detail="Carrito vacío")
    items = session.exec(select(CartItem).where(CartItem.cart_id == cart.id)).all()
    if not items:
        raise HTTPException(status_code=400, detail="No hay items en el carrito")
    # Verificar stock nuevamente
    for it in items:
        prod = session.get(Product, it.product_id)
        if not prod or prod.existencia < it.cantidad:
            raise HTTPException(status_code=400, detail=f"Producto {prod.nombre if prod else it.product_id} sin stock suficiente")
    subtotal, iva = calculate_tax_and_subtotal(items, session)
    envio = 0.0 if subtotal > 1000 else 50.0
    total = round(subtotal + iva + envio, 2)
    # crear compra
    purchase = Purchase(usuario_id=user.id, direccion=payload.direccion, tarjeta=payload.tarjeta, total=total, envio=envio)
    session.add(purchase)
    session.commit()
    session.refresh(purchase)
    # crear items y decrementar stock
    for it in items:
        prod = session.get(Product, it.product_id)
        pi = PurchaseItem(purchase_id=purchase.id, producto_id=prod.id, cantidad=it.cantidad, nombre=prod.nombre, precio_unitario=prod.precio)
        session.add(pi)
        prod.existencia -= it.cantidad
        session.delete(it)
    cart.estado = "finalized"
    session.add(cart)
    session.commit()
    return {"ok": True, "purchase_id": purchase.id}


@app.post("/carrito/cancelar")
def cancelar_compra(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    cart = session.exec(select(Cart).where(Cart.usuario_id == user.id, Cart.estado == "open")).first()
    if not cart:
        return {"ok": True}
    items = session.exec(select(CartItem).where(CartItem.cart_id == cart.id)).all()
    for it in items:
        session.delete(it)
    session.commit()
    return {"ok": True}


@app.get("/compras")
def listar_compras(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    purchases = session.exec(select(Purchase).where(Purchase.usuario_id == user.id)).all()
    return purchases


@app.get("/compras/{purchase_id}")
def detalle_compra(purchase_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    purchase = session.get(Purchase, purchase_id)
    if not purchase or purchase.usuario_id != user.id:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    return purchase


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
