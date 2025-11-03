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
        productos = session.exec(select(Producto)).all()
        if not productos:
            with open(SEED_PATH, "r", encoding="utf-8") as archivo:
                datos_productos = json.load(archivo)
                for item in datos_productos:
                    producto = Producto(**item)
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

# Endpoints de Auth

# @app.post("/registrar")
# @app.post("/iniciar-sesion")
# @app.post("/cerrar-sesion")


# Endpoints de Productos

#Obtener lista de productos (con filtros opciones por categoria y busqueda por nombre)

# @app.get("/productos")

# @app.get("/productos/{id}")


# # Endpoints de Carrito
# @app.post("/carrito")
# @app.delete("/carrito/{producto_id}")
# @app.get("/carrito")
# @app.post("/carrito/finalizar")
# @app.post("/carrito/cancelar")

# #Endpoints de Compras
# @app.get("/compras")
# @app.get("/compras/{compra_id}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
