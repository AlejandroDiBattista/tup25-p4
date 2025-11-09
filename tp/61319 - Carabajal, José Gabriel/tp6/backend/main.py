from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

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


@app.get("/productos")
def obtener_productos(
    categoria: Optional[str] = None,
    q: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Devuelve productos. Filtros opcionales:
    - categoria: filtra por categoría (case-insensitive). Si es 'todas', no filtra.
    - q: busca texto en título o descripción.
    """
    productos = cargar_productos()

    if categoria and categoria.lower() != "todas":
        productos = [
            p for p in productos
            if p.get("categoria", "").lower() == categoria.lower()
        ]

    if q:
        q_lower = q.lower()
        productos = [
            p for p in productos
            if q_lower in p.get("titulo", "").lower() or q_lower in p.get("descripcion", "").lower()
        ]

    return productos


# ---------- Routers ----------
# Auth (registrar / iniciar-sesion)
app.include_router(auth_router.router, tags=["auth"])


# ---------- Modo script (opcional) ----------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
