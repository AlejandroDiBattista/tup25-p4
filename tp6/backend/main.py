from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from sqlmodel import Session

from database import create_db_and_tables, engine
from models import Producto
from routes import auth, productos, carrito, compras

# Crear aplicación FastAPI
app = FastAPI(
    title="API Tienda Electrónica",
    description="API para un sitio de comercio electrónico",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001", "http://localhost:3002", "http://127.0.0.1:3002"],  # permitir el frontend en dev (múltiples puertos)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos (imágenes) si existe la carpeta 'imagenes' en el backend
try:
    app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")
except Exception:
    # Si la carpeta no existe en el entorno actual, no interrumpimos el arranque.
    pass

# Registrar rutas
app.include_router(auth.router)
app.include_router(productos.router)
app.include_router(carrito.router)
app.include_router(compras.router)


@app.on_event("startup")
def on_startup():
    """Se ejecuta al iniciar la aplicación"""
    create_db_and_tables()
    cargar_productos_iniciales()


@app.get("/")
def root():
    """Endpoint raíz"""
    return {
        "mensaje": "Bienvenido a la API de la Tienda Electrónica",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }


def cargar_productos_iniciales():
    """Carga los productos iniciales desde productos.json"""
    try:
        with open("productos.json", "r", encoding="utf-8") as f:
            datos = json.load(f)
    except FileNotFoundError:
        print("Archivo productos.json no encontrado. Saltando carga inicial.")
        return
    except json.JSONDecodeError:
        print("Error al decodificar productos.json. Saltando carga inicial.")
        return
    
    with Session(engine) as session:
        # Verificar si ya hay productos
        productos_existentes = session.query(Producto).count()
        if productos_existentes > 0:
            return
        
        # Cargar productos
        for prod_data in datos.get("productos", []):
            producto = Producto(
                nombre=prod_data.get("nombre"),
                descripcion=prod_data.get("descripcion", ""),
                precio=float(prod_data.get("precio", 0)),
                categoria=prod_data.get("categoria", "General"),
                existencia=int(prod_data.get("existencia", 0)),
                imagen_url=prod_data.get("imagen_url"),
                es_electronico=prod_data.get("es_electronico", False)
            )
            session.add(producto)
        
        session.commit()
        print(f"Se cargaron {len(datos.get('productos', []))} productos inicialmente.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
