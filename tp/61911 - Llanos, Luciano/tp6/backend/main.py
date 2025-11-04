from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import json

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

@app.get("/productos")
def obtener_productos():
    """Obtener lista de productos"""
    productos = cargar_productos()
    return productos

@app.get("/productos/{producto_id}")
def obtener_producto(producto_id: int):
    """Obtener un producto específico por ID"""
    productos = cargar_productos()
    for producto in productos:
        if producto["id"] == producto_id:
            return producto
    return {"error": "Producto no encontrado"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
