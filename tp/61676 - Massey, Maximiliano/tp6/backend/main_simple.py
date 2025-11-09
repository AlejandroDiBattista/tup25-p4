from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from pathlib import Path

app = FastAPI(title="TP6 Shop API")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar directorio de imágenes como archivos estáticos
try:
    app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")
except:
    pass  # En caso de que no exista el directorio

# Cargar productos desde el archivo JSON
def cargar_productos():
    try:
        ruta_productos = Path(__file__).parent / "productos.json"
        with open(ruta_productos, "r", encoding="utf-8") as archivo:
            return json.load(archivo)
    except:
        # Datos de ejemplo si no existe el archivo
        return [
            {
                "id": 1,
                "nombre": "Producto de prueba",
                "descripcion": "Este es un producto de prueba",
                "precio": 10.99,
                "categoria": "test",
                "existencia": 5,
                "imagen": "test.jpg"
            }
        ]

@app.get("/")
def root():
    return {"mensaje": "API TP6 Shop funcionando correctamente"}

@app.get("/productos")
async def obtener_productos(search: str = None, categoria: str = None):
    productos = cargar_productos()
    
    # Normalizar campos (titulo -> nombre)
    for producto in productos:
        if "titulo" in producto:
            producto["nombre"] = producto["titulo"]
    
    # Filtrar por búsqueda
    if search:
        search = search.lower()
        productos = [p for p in productos if search in p.get("nombre", "").lower() or search in p.get("descripcion", "").lower()]
    
    # Filtrar por categoría
    if categoria:
        productos = [p for p in productos if p.get("categoria", "").lower() == categoria.lower()]
    
    return productos

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)