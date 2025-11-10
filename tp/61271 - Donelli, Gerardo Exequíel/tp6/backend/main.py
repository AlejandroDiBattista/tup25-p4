from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, create_engine, Session
import json
from pathlib import Path

# Importar todos los modelos
from models import Usuario, Producto, Carrito, ItemCarrito, Compra, ItemCompra

# Configuración de la base de datos
DATABASE_URL = "sqlite:///./ecommerce.db"
engine = create_engine(DATABASE_URL, echo=True)

# Crear la aplicación FastAPI
app = FastAPI(title="API E-Commerce")

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


def crear_tablas():
    """Crear todas las tablas en la base de datos."""
    SQLModel.metadata.create_all(engine)


def obtener_session():
    """Dependencia para obtener una sesión de base de datos."""
    with Session(engine) as session:
        yield session


@app.on_event("startup")
def on_startup():
    """Ejecutar al iniciar la aplicación."""
    crear_tablas()
    print("✅ Base de datos inicializada y tablas creadas")


# Cargar productos desde el archivo JSON (temporal, se migrará a BD)
def cargar_productos():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)


@app.get("/")
def root():
    return {"mensaje": "API E-Commerce - Bienvenido"}


@app.get("/productos")
def obtener_productos():
    """Obtener lista de productos (temporal desde JSON)."""
    productos = cargar_productos()
    return productos


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
