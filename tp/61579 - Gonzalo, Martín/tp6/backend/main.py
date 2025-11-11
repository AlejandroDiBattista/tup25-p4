import json
from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, Session, create_engine, select

# Importamos TODOS los modelos que creamos
# (Aunque no se usen directamente aquí, SQLModel los necesita
# para crear las tablas)
from models.productos import Producto
from models.usuarios import Usuario
from models.compras import CarritoItem, Compra, CompraItem


# --- 1. Configuración de la Base de Datos ---

# Define el nombre del archivo de la base de datos
DATABASE_FILE = "ecommerce.db"
# Crea la URL de conexión para SQLite
engine = create_engine(f"sqlite:///{DATABASE_FILE}")


def create_db_and_tables():
    """Crea la base de datos y todas las tablas."""
    # SQLModel.metadata.create_all() lee todos los modelos
    # que heredan de SQLModel (como Producto, Usuario, etc.)
    # y crea las tablas correspondientes en la base de datos.
    SQLModel.metadata.create_all(engine)


def load_initial_products():
    """
    Carga los productos iniciales desde productos.json
    a la base de datos SQLite, SOLO si la tabla está vacía.
    """
    with Session(engine) as session:
        # Revisa si ya hay productos en la tabla
        statement = select(Producto)
        products_in_db = session.exec(statement).first()

        # Si no hay productos (products_in_db es None), los carga
        if not products_in_db:
            print("INFO:     Base de datos vacía, cargando productos iniciales...")
            try:
                with open("productos.json", "r") as f:
                    products_data = json.load(f)
                    for prod_data in products_data:
                        producto = Producto(**prod_data)
                        session.add(producto)
                    session.commit()
                print("INFO:     Productos iniciales cargados con éxito.")
            except FileNotFoundError:
                print("ADVERTENCIA: No se encontró 'productos.json'.")
            except Exception as e:
                print(f"ERROR: No se pudieron cargar productos: {e}")


# --- 2. Eventos de Ciclo de Vida (Lifespan) ---

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Define lo que la app debe hacer al arrancar y al apagarse.
    """
    # Al arrancar:
    print("INFO:     Iniciando aplicación...")
    create_db_and_tables()
    load_initial_products()
    yield
    # Al apagarse:
    print("INFO:     Apagando aplicación...")


# --- 3. Creación de la Aplicación FastAPI ---

app = FastAPI(
    title="API E-Commerce TP6",
    description="API para el proyecto de E-Commerce con FastAPI y SQLModel.",
    version="0.1.0",
    lifespan=lifespan  # Asigna el ciclo de vida
)

# --- 4. Configuración de CORS ---

# Permite que el frontend (en localhost:3000) se comunique
# con este backend (en localhost:8000)
origins = [
    "http://localhost:3000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 5. Montaje de Archivos Estáticos ---

# Permite que el frontend acceda a las imágenes
# desde la URL http://localhost:8000/imagenes/teclado.jpg
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")


# --- 6. Endpoint de Bienvenida ---

@app.get("/")
def read_root():
    """Endpoint raíz para verificar que la API está funcionando."""
    return {"mensaje": "Bienvenido a la API E-Commerce del TP6"}

