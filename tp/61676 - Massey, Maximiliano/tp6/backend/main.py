from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, SQLModel, create_engine, select
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
import json
from pathlib import Path
import bcrypt

from models.usuarios import Usuario
from models.carrito import ItemCarrito
from models.compras import Compra, CompraItem

# Esquemas Pydantic
class UsuarioRegistro(BaseModel):
    nombre: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Configuración de la base de datos
DATABASE_URL = "sqlite:///./tienda.db"
engine = create_engine(DATABASE_URL, echo=False)

# Configuración de JWT (simplificada)
SECRET_KEY = "clave_secreta_super_segura_cambiar_en_produccion_123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Crear aplicación
app = FastAPI(title="TP6 Shop API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# Montar imágenes
try:
    app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")
except:
    pass

# Dependencias
def get_db():
    with Session(engine) as session:
        yield session

# Funciones auxiliares para passwords usando bcrypt directamente
def hash_password(password: str) -> str:
    """Hash de password usando bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar password"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# Función para crear token JWT (simplificada sin jose)
def create_access_token(email: str) -> str:
    """Crear token simple (en producción usar JWT real)"""
    import base64
    token_data = f"{email}:{SECRET_KEY}:{datetime.utcnow().isoformat()}"
    return base64.b64encode(token_data.encode()).decode()

def verify_token(token: str) -> Optional[str]:
    """Verificar token y retornar email"""
    try:
        import base64
        decoded = base64.b64decode(token.encode()).decode()
        parts = decoded.split(':')
        if len(parts) >= 2 and parts[1] == SECRET_KEY:
            return parts[0]  # email
    except:
        pass
    return None

# Obtener usuario actual
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Usuario:
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    usuario = db.exec(select(Usuario).where(Usuario.email == email)).first()
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return usuario

# Cargar productos
def cargar_productos():
    try:
        ruta = Path(__file__).parent / "productos.json"
        with open(ruta, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []

# RUTAS

@app.get("/")
def root():
    return {"mensaje": "API TP6 Shop - Backend funcionando"}

@app.get("/productos")
async def obtener_productos(search: str = None, categoria: str = None):
    productos = cargar_productos()
    
    if search:
        search = search.lower()
        productos = [p for p in productos if search in str(p.get("nombre", "")).lower() or search in str(p.get("descripcion", "")).lower()]
    
    if categoria:
        productos = [p for p in productos if str(p.get("categoria", "")).lower() == categoria.lower()]
    
    return productos

@app.post("/registrar")
async def registrar_usuario(usuario_data: UsuarioRegistro, db: Session = Depends(get_db)):
    """Registrar nuevo usuario"""
    # Verificar si existe
    existe = db.exec(select(Usuario).where(Usuario.email == usuario_data.email)).first()
    if existe:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # Crear usuario
    usuario = Usuario(
        nombre=usuario_data.nombre,
        email=usuario_data.email,
        password_hash=hash_password(usuario_data.password)
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    
    return {"mensaje": "Usuario registrado exitosamente", "id": usuario.id}

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login de usuario"""
    usuario = db.exec(select(Usuario).where(Usuario.email == form_data.username)).first()
    if not usuario or not verify_password(form_data.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    access_token = create_access_token(usuario.email)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email
        }
    }

@app.get("/user/me")
async def obtener_usuario_actual(current_user: Usuario = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "nombre": current_user.nombre
    }

@app.get("/carrito")
async def obtener_carrito(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.exec(select(ItemCarrito).where(ItemCarrito.usuario_id == current_user.id)).all()
    return {"items": [{"id": i.id, "producto_id": i.producto_id, "cantidad": i.cantidad} for i in items]}

@app.post("/carrito/agregar/{producto_id}")
async def agregar_al_carrito(producto_id: int, cantidad: int, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verificar producto
    productos = cargar_productos()
    producto = next((p for p in productos if p["id"] == producto_id), None)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    if producto.get("existencia", 0) < cantidad:
        raise HTTPException(status_code=400, detail="Stock insuficiente")
    
    # Buscar item existente
    item = db.exec(select(ItemCarrito).where(ItemCarrito.usuario_id == current_user.id, ItemCarrito.producto_id == producto_id)).first()
    
    if item:
        item.cantidad += cantidad
    else:
        item = ItemCarrito(usuario_id=current_user.id, producto_id=producto_id, cantidad=cantidad)
        db.add(item)
    
    db.commit()
    return {"mensaje": "Producto agregado al carrito"}

@app.delete("/carrito/quitar/{producto_id}")
async def quitar_del_carrito(producto_id: int, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.exec(select(ItemCarrito).where(ItemCarrito.usuario_id == current_user.id, ItemCarrito.producto_id == producto_id)).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    
    db.delete(item)
    db.commit()
    return {"mensaje": "Producto eliminado"}

@app.get("/compras")
async def obtener_compras(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    compras = db.exec(select(Compra).where(Compra.usuario_id == current_user.id)).all()
    return [{"id": c.id, "total": c.total, "fecha": c.fecha_creacion, "direccion": c.direccion} for c in compras]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
