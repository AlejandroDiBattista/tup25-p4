from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, Session, create_engine, select
from pathlib import Path
from typing import Optional
import json

from models import Producto

app = FastAPI(title="API Productos")

# Archivos estáticos (imágenes)
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# Base de datos (SQLModel + SQLite)
# ==============================
DB_URL = "sqlite:///./ParcialProgramacion.db"  # cra parcialdb en esta carpeta
engine = create_engine(DB_URL, echo=False)


def get_session():
    with Session(engine) as session:
        yield session


@app.on_event("startup")
def on_startup():
    # Crear tablas si no existen y cargar productos al iniciar
    SQLModel.metadata.create_all(engine)
    init_productos_desde_json()


def init_productos_desde_json():
    """
    Carga productos desde productos.json solo si la tabla está vacía.
    Soporta el alias 'titulo' -> 'nombre' definido en el modelo.
    """
    ruta_productos = Path(__file__).parent / "productos.json"
    if not ruta_productos.exists():
        return

    with Session(engine) as session:
        existe = session.exec(select(Producto.id)).first()
        if existe:
            return  # ya hay datos

        with open(ruta_productos, "r", encoding="utf-8") as f:
            datos = json.load(f)

        for p in datos:
            prod = Producto.model_validate(p)  # respeta alias del modelo
            session.add(prod)
        session.commit()


# ==============================
# Endpoints mínimos (desde BD)
# ==============================
@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}


@app.get("/productos")
def obtener_productos(
    categoria: Optional[str] = None,
    buscar: Optional[str] = None,
    session: Session = Depends(get_session),
):
    prods = session.exec(select(Producto)).all()
    if categoria:
        prods = [p for p in prods if categoria.lower() in (p.categoria or "").lower()]
    if buscar:
        q = buscar.lower()
        prods = [p for p in prods if q in (p.nombre or "").lower() or q in (p.descripcion or "").lower()]

    def imagen_url_for(img: Optional[str]) -> Optional[str]:
        if not img:
            return None
        # Si ya viene "imagenes/...", no duplicar
        return f"/{img}" if img.startswith("imagenes/") else f"/imagenes/{img}"

    return [
        {
            "id": p.id,
            "titulo": p.nombre,           # añadido para el frontend
            "nombre": p.nombre,
            "descripcion": p.descripcion,
            "precio": p.precio,
            "categoria": p.categoria,
            "existencia": p.existencia,
            "valoracion": getattr(p, "valoracion", None),
            "imagen": p.imagen,
            "imagen_url": imagen_url_for(p.imagen),
            "agotado": p.existencia <= 0,
        }
        for p in prods
    ]


@app.get("/health")
def health(session: Session = Depends(get_session)):
    try:
        ids = session.exec(select(Producto.id)).all()
        db_status = "online"
        ok = True
    except Exception as e:
        ids = []
        db_status = f"error: {type(e).__name__}"
        ok = False

    base = Path(__file__).parent
    return {
        "ok": ok,
        "db": db_status,
        "db_url": DB_URL,
        "productos": len(ids),
        "productos_json_exists": (base / "productos.json").exists(),
        "imagenes_dir_exists": (base / "imagenes").exists(),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
