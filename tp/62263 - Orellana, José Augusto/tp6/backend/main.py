from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from pathlib import Path

from contextlib import asynccontextmanager
from database import create_db_and_tables

# Función lifespan para inicializar la base de datos al iniciar la aplicación
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("iniciando la aplicación...")
    print("Creando la base de datos y las tablas si no existen...")

    create_db_and_tables()

    print("Base de datos y tablas listas.")
    print("Servidor listo.")
    yield
    # Esto se ejecuta al apagar la aplicación
    print("Apagando la aplicación...")

# Se agrega el lifespan a la aplicación FastAPI
app = FastAPI(
    title="API de E-Commerce - TP6",
    lifespan=lifespan
)

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

@app.get("/productos")
def obtener_productos():
    productos = cargar_productos()
    return productos

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
