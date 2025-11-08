from pathlib import Path
from sqlmodel import SQLModel, create_engine, Session

# Importar modelos específicos para que se registren en metadata antes de create_all
from models.productos import Producto  # noqa: F401
from models.usuario import Usuario  # noqa: F401
from models.carrito import Carrito, CarritoItem  # noqa: F401
from models.compra import Compra, CompraItem  # noqa: F401

# Base de datos SQLite en el mismo directorio del backend
DATABASE_PATH = Path(__file__).parent / "database.db"
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# engine compartido
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})

def create_db():
    """Crear todas las tablas declaradas en los modelos (si no existen)."""
    SQLModel.metadata.create_all(engine)

def get_session():
    return Session(engine)
