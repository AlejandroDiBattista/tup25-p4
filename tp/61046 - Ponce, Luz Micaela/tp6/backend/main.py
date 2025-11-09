from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from pathlib import Path
from  sqlmodel import SQLModel, create_engine, Session, select
from typing import List

from models.productos import (
    Producto, Usuario, Carrito, CarritoItem, Compra, CompraItem
)

DATABASE_FILE = "database.db"
DATABASE_URL = f"sqlite:///{DATABASE_FILE}"

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """
        Crea el archivo de la base de datos y todas las tablas
        definidas en los modelos (PRoducto, Usuario, etc.)
    """
    SQLModel.metadata.create_all(engine)

def cargar_datos_iniciales():
    """
    Carga los productos desde productos.json a la base de datos.
    Solo se ejecuta si no hay productos ya cargados.
    """
    with Session(engine) as session:
        producto_existente = session.exec(select(Producto)).first()

        if not producto_existente:
            print("Base de datos vacía, cargando productos iniciales...")

            ruta_productos = Path(__file__).parent / "productos.json"

            with open(ruta_productos, "r", encoding="utf-8") as archivo:
                datos = json.load(archivo)

                for item in datos:
                    producto_nuevo = Producto(
                        id=item.get("id"),
                        nombre=item["titulo"],
                        descripcion=item["descripcion"],
                        precio=item["precio"],
                        categoria=item["categoria"],
                        existencia=item["existencia"]
                    )
                    session.add(producto_nuevo)

                session.commit()
                print("Productos cargados exitosamente.")
        else:
            print("La base de datos ya tiene productos. No se cargan datos.")


def get_session():
    """
    Crea una nueva sesión de base de datos para cada petición.
    FastAPI usará esto como una "Dependencia" (Depends).
    """
    with Session(engine) as session:
        yield session

app = FastAPI(title="API TP6 - E-Commerce")

@app.on_event("startup")
def on_startup():
    print("Iniciando aplicación...")
    create_db_and_tables()
    cargar_datos_iniciales()
    print("Aplicación lista.")

app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"mensaje": "API de E-Commerce - use /docs para ver la documentación"}

@app.get("/productos", response_model=List[Producto])
def obtener_productos(session: Session = Depends(get_session)):
    """
    Obtiene la lista de todos los productos desde la base de datos.
    """
    productos = session.exec(select(Producto)).all()
    return productos

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)