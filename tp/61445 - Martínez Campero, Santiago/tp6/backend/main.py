"""API Principal del E-Commerce con FastAPI."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, create_engine, Session
from pathlib import Path
import json

from config import DATABASE_URL, ALLOWED_ORIGINS

# Crear la aplicación FastAPI
app = FastAPI(
    title="TP6 Shop API",
    description="API de E-Commerce con FastAPI y SQLite",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar directorio de imágenes como archivos estáticos
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# Configurar base de datos
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False
)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    cargar_productos_iniciales()


def cargar_productos_iniciales():
    from sqlmodel import select
    from models import Producto
    
    with Session(engine) as session:
        statement = select(Producto)
        productos_existentes = session.exec(statement).all()
        
        if len(productos_existentes) > 0:
            return
        
        ruta_productos = Path(__file__).parent / "productos.json"
        with open(ruta_productos, "r", encoding="utf-8") as archivo:
            datos = json.load(archivo)
        
        for item in datos:
            producto = Producto(
                id=item.get("id"),
                nombre=item.get("titulo"),
                descripcion=item.get("descripcion"),
                precio=item.get("precio"),
                categoria=item.get("categoria"),
                existencia=item.get("existencia", 0),
                valoracion=item.get("valoracion", 0.0),
                imagen=item.get("imagen")
            )
            session.add(producto)
        
        session.commit()


# Endpoints básicos de bienvenida
@app.get("/")
def root():
    return {
        "mensaje": "API de TP6 Shop - E-Commerce",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
