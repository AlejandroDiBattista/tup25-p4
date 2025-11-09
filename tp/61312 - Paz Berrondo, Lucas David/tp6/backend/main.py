from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from pathlib import Path

# Importar modelos y database
from models import Producto
from database import create_db_and_tables, get_session, engine
from sqlmodel import Session, select

app = FastAPI(title="API Productos")

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


# Evento de inicio: crear tablas y cargar datos iniciales
@app.on_event("startup")
def on_startup():
    """Inicializar base de datos y cargar productos desde JSON."""
    # Crear todas las tablas
    create_db_and_tables()
    
    # Cargar productos desde JSON si la tabla está vacía
    with Session(engine) as session:
        productos_existentes = session.exec(select(Producto)).first()
        
        if not productos_existentes:
            # Cargar productos desde el archivo JSON
            ruta_productos = Path(__file__).parent / "productos.json"
            with open(ruta_productos, "r", encoding="utf-8") as archivo:
                productos_json = json.load(archivo)
            
            # Insertar productos en la base de datos
            for producto_data in productos_json:
                producto = Producto(
                    id=producto_data["id"],
                    nombre=producto_data["titulo"],
                    descripcion=producto_data["descripcion"],
                    precio=producto_data["precio"],
                    categoria=producto_data["categoria"],
                    existencia=producto_data["existencia"],
                    imagen=producto_data["imagen"]
                )
                session.add(producto)
            
            session.commit()
            print(f"✅ {len(productos_json)} productos cargados en la base de datos")


@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}


@app.get("/productos")
def obtener_productos():
    """Obtener todos los productos de la base de datos."""
    with Session(engine) as session:
        productos = session.exec(select(Producto)).all()
        return productos

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
