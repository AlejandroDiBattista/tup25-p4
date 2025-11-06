from fastapi import FastAPI, Depends
from sqlmodel import Session, select
from models.productos import Producto
from models.usuarios import Usuario
from models.carrito import CarritoItem
from models.compras import Compra
from database import create_db_and_tables, get_session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from pathlib import Path

app = FastAPI(title="API Productos")

# Montar directorio de imágenes como archivos estáticos
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# Crear las tablas al iniciar
@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    inicializar_datos()

# Carga los productos del archivo JSON si la base de datos está vacía
def inicializar_datos():
    from sqlmodel import select
    from database import engine

# Si no hay productos, se cargan desde productos.json
    with Session(engine) as session:
         if not session.exec(select(Producto)).first():
            ruta = Path(__file__).parent / "productos.json"
            if ruta.exists():
                with open(ruta, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for p in data:
                        session.add(Producto(**p))
                session.commit()
                print("Productos cargados desde productos.json")
            else:
                print("No se encontró el archivo productos.json")

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

@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}

# Productos
@app.get("/productos")
def cargar_productos_desde_json():
    """Carga productos desde productos.json si la base está vacía."""
    ruta = Path(__file__).parent / "productos.json"
    if ruta.exists():
        with open(ruta, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@app.get("/productos/", response_model=list[Producto])
def listar_productos(session: Session = Depends(get_session)):
    productos = session.exec(select(Producto)).all()
    # Si no hay productos en la BD, cargamos los del JSON
    if not productos:
        data = cargar_productos_desde_json()
        for p in data:
            session.add(Producto(**p))
        session.commit()
        productos = session.exec(select(Producto)).all()
    return productos

# Usuarios
@app.post("/usuarios/", response_model=Usuario)
def crear_usuario(usuario: Usuario, session: Session = Depends(get_session)):
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    return usuario

#  Carrito 
@app.post("/carrito/", response_model=CarritoItem)
def agregar_al_carrito(item: CarritoItem, session: Session = Depends(get_session)):
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

# Compras
@app.post("/compras/", response_model=Compra)
def registrar_compra(compra: Compra, session: Session = Depends(get_session)):
    session.add(compra)
    session.commit()
    session.refresh(compra)
    return compra


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
