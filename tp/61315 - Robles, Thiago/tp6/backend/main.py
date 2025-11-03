from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, Session, create_engine, select

import json
from pathlib import Path

from models.usuario import Usuario
from models.producto import Producto
from models.compra import Compras, CompraItem
from models.carrito import Carrito, CarritoItem



BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "parcialdatabase.db"
SEED_PATH = BASE_DIR / "productos.json"

engine = create_engine(f"sqlite:///{DB_PATH}", echo=True)

app = FastAPI(title="API Productos")

def crear_db ():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        if not session.exec(select(Producto)).first():
            with open(SEED_PATH, "r", encoding="utf-8") as archivo:
                productos = json.load(archivo)
                for prod_data in productos:
                    producto = Producto(**prod_data)
                    session.add(producto)
            session.commit()

@app.on_event("startup")
def on_startup():
    crear_db()



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
    


@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}

# Endpoints de Productos

@app.get("/productos")
def obtener_productos():
    productos = cargar_productos()
    return productos

@app.get("/productos/{id}")
def obtener_producto_por_id(id: int):
    productos = cargar_productos()
    for producto in productos:
        if producto["id"] == id:
            return producto
    return {"mensaje": "Producto no encontrado"}, 404


# Endpoints de Login
@app.post("/registrar")
def registrar_usuario():

    return {"mensaje": "Registro de usuario no implementado"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
