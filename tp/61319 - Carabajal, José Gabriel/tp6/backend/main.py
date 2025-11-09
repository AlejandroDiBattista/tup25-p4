from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional
from fastapi import Query

from pathlib import Path
import json
from typing import List, Dict, Any, Optional

from db import create_db_and_tables
from routers import auth as auth_router


app = FastAPI(title="TP6 Shop API")

# Archivos estáticos (imágenes de productos)
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# CORS (abrimos para el frontend local)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # podés ajustar a ["http://localhost:3000"] si querés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Utilidades ----------
def cargar_productos() -> List[Dict[str, Any]]:
    """Carga el listado de productos desde productos.json."""
    ruta_productos = Path(__file__).parent / "productos.json"
    with ruta_productos.open("r", encoding="utf-8") as f:
        return json.load(f)


# ---------- Eventos de app ----------
@app.on_event("startup")
def on_startup() -> None:
    # Crea las tablas (Usuario, etc.) si no existen
    create_db_and_tables()


# ---------- Rutas base ----------
@app.get("/")
def root() -> Dict[str, str]:
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}


from typing import Optional
from fastapi import Query

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
# Auth (registrar / iniciar-sesion)
app.include_router(auth_router.router, tags=["auth"])


# ---------- Modo script (opcional) ----------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
