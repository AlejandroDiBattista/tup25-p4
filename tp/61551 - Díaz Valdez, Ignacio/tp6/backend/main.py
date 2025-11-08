from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from pathlib import Path
from collections import OrderedDict

from db import create_db, get_session, engine
from models.productos import Producto
from sqlmodel import select


app = FastAPI(title="API Productos")

# Inicializar la base de datos al importar (crea tablas si no existen)
create_db()

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


def cargar_productos_desde_json():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)


@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}


@app.get("/productos")
def obtener_productos():
    """Intentar leer productos desde la base de datos; si no hay datos, hacer fallback al JSON original."""
    try:
        with get_session() as session:
            resultados = session.exec(select(Producto)).all()
            if resultados:
                # Orden deseado de claves (igual al JSON fuente):
                claves = [
                    "id",
                    "titulo",
                    "precio",
                    "descripcion",
                    "categoria",
                    "valoracion",
                    "existencia",
                    "imagen",
                ]
                lista = []
                for p in resultados:
                    base = p.dict(exclude_none=True)
                    ordenado = OrderedDict()
                    for k in claves:
                        if k in base:
                            ordenado[k] = base[k]
                    # Incluir cualquier clave adicional al final (por compatibilidad futura)
                    for k, v in base.items():
                        if k not in ordenado:
                            ordenado[k] = v
                    lista.append(ordenado)
                return {"value": lista, "Count": len(lista)}
    except Exception:
        # cualquier problema con la BD -> fallback
        pass

    # Fallback al JSON, pero normalizando al formato { value, Count }
    lista = cargar_productos_desde_json()
    return {"value": lista, "Count": len(lista)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
