# backend/main.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional, List, Dict, Any

from db import create_db_and_tables

# Fuerza el registro de las tablas nuevas antes de create_all
from models import carrito as _carrito_models  # noqa: F401
from models import compras as _compras_models  # noqa: F401

# Routers
from routers import auth as auth_router
from routers import carrito as carrito_router
from routers import compras as compras_router

# Utilidad para leer productos (moved from main.py → utils/products.py)
from utils.products import cargar_productos

app = FastAPI(title="TP6 Shop API")

# Archivos estáticos (imágenes de productos)
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# CORS (abrimos para el frontend local)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Podés ajustar a ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Eventos de app ----------
@app.on_event("startup")
def on_startup() -> None:
    # Crea las tablas si no existen
    create_db_and_tables()

# ---------- Rutas base ----------
@app.get("/")
def root() -> Dict[str, str]:
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}

@app.get("/productos")
def obtener_productos(
    search: Optional[str] = Query(None, description="Texto a buscar en título o descripción"),
    categoria: Optional[str] = Query(None, description="Categoría exacta (ej: 'Ropa de hombre')")
):
    productos = cargar_productos()

    # Filtro por texto (título o descripción)
    if search:
        s = search.lower()
        productos = [
            p for p in productos
            if s in p["titulo"].lower() or s in p["descripcion"].lower()
        ]

    # Filtro por categoría (exacta, ignorando mayúsculas)
    if categoria and categoria.lower() != "todas":
        productos = [p for p in productos if p["categoria"].lower() == categoria.lower()]

    return productos

# ---------- Routers ----------
app.include_router(auth_router.router, tags=["auth"])
app.include_router(carrito_router.router, tags=["carrito"])
app.include_router(compras_router.router, tags=["compras"])

# ---------- Modo script (opcional) ----------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
