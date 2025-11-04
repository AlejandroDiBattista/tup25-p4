from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from pathlib import Path
from typing import List
import json

# Importar configuración de base de datos y modelos
from database import crear_tablas, get_session, inicializar_datos
from models.productos import Producto, ProductoPublico

# Crear la aplicación FastAPI
app = FastAPI(
    title="API E-Commerce",
    description="API para sistema de comercio electrónico con FastAPI y SQLModel",
    version="1.0.0"
)

# Montar directorio de imágenes como archivos estáticos
imagenes_dir = Path(__file__).parent / "imagenes"
app.mount("/imagenes", StaticFiles(directory=str(imagenes_dir)), name="imagenes")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Función para cargar productos desde JSON
def cargar_productos():
    """Cargar productos desde el archivo JSON"""
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

# Evento de inicio - crear tablas y cargar datos
@app.on_event("startup")
def on_startup():
    """Inicializar base de datos al arrancar la aplicación"""
    crear_tablas()
    inicializar_datos()

# ===============================================
# ENDPOINTS BÁSICOS
# ===============================================

@app.get("/")
def root():
    return {"mensaje": "API de E-Commerce - use /productos para obtener el listado"}

@app.get("/health")
def health_check():
    from datetime import datetime
    return {"status": "ok", "timestamp": datetime.now()}

@app.get("/productos", response_model=List[ProductoPublico])
def obtener_productos(session: Session = Depends(get_session)):
    """Obtener lista de productos desde la base de datos"""
    productos = session.exec(select(Producto)).all()
    return productos

@app.get("/productos/{producto_id}", response_model=ProductoPublico)
def obtener_producto(producto_id: int, session: Session = Depends(get_session)):
    """Obtener un producto específico por ID"""
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

@app.get("/categorias")
def obtener_categorias(session: Session = Depends(get_session)):
    """Obtener lista de categorías disponibles"""
    query = select(Producto.categoria).distinct()
    categorias = session.exec(query).all()
    return {"categorias": categorias}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
