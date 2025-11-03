from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from pathlib import Path

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
