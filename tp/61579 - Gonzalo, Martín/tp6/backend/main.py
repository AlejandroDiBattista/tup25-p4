import json
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, Session, create_engine, select

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
    SQLModel.metadata.create_all(engine)


def load_initial_products():
    """
    Carga los productos iniciales desde productos.json
    a la base de datos SQLite, SOLO si la tabla está vacía.
    """
    with Session(engine) as session:
        statement = select(Producto)
        products_in_db = session.exec(statement).first()

        if not products_in_db:
            print("INFO:     Base de datos vacía, cargando productos iniciales...")
            try:
                with open("productos.json", "r", encoding="utf-8") as f:
                    products_data = json.load(f)
                    
                    for prod_data in products_data:
                        img_path = prod_data.get("imagen")
                        if img_path and img_path.startswith("imagenes/"):
                            # Quita el prefijo "imagenes/"
                            prod_data["imagen"] = img_path.split("/")[-1] 
                        
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

from fastapi import Depends

def get_session():
    """
    Dependencia de FastAPI: 
    Crea y devuelve una nueva sesión de BBDD por cada petición.
    Se asegura de que la sesión se cierre al terminar.
    """
    with Session(engine) as session:
        yield session

@app.get("/productos", response_model=List[Producto])
def get_productos(session: Session = Depends(get_session)):
    """
    Obtiene una lista de todos los productos.
    (Prueba 2.1 de api-tests.http)
    """
    statement = select(Producto)
    
    productos = session.exec(statement).all()
    
    return productos


@app.get("/productos/{producto_id}", response_model=Producto)
def get_producto(producto_id: int, session: Session = Depends(get_session)):
    """
    Obtiene un producto específico por su ID.
    (Prueba 2.5 y 2.6 de api-tests.http)
    """
    # session.get() es la forma más rápida de buscar por Llave Primaria (ID)
    producto = session.get(Producto, producto_id)
    
    if not producto:
        # Si el producto es None (no se encontró),
        # levanta un error 404 Not Found.
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    return producto

@app.get("/productos", response_model=List[Producto])
def get_productos(
    session: Session = Depends(get_session),
    buscar: Optional[str] = None,
    categoria: Optional[str] = None
):
    """
    Obtiene una lista de todos los productos, con filtros opcionales
    de búsqueda por texto y categoría.
    (Pruebas 2.1, 2.2, 2.3, 2.4 de api-tests.http)
    """
    # La consulta base es "SELECT * FROM producto"
    statement = select(Producto)

    # --- Filtro de Búsqueda (Prueba 2.2) ---
    if buscar:
        from sqlmodel import or_
        statement = statement.where(
            or_(
                Producto.titulo.contains(buscar),
                Producto.descripcion.contains(buscar)
            )
        )

    # --- Filtro de Categoría (Prueba 2.3) ---
    if categoria:
        statement = statement.where(Producto.categoria == categoria)

    # Ejecuta la consulta (ya con los filtros aplicados, si los hubo)
    productos = session.exec(statement).all()
    
    # Si no hay productos que coincidan, devolverá una lista vacía
    # (lo cual es correcto, no es un error 404)
    return productos