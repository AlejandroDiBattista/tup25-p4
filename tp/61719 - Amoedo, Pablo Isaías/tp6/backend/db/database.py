from sqlmodel import SQLModel, create_engine, Session, select
import json
import os
from models.productos import Producto

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=False)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def load_initial_data():
    # Abrir sesión
    with Session(engine) as session:
        # Verificar si ya existen productos en la DB
        existing = session.exec(select(Producto)).first()
        if existing:
            return  # Ya hay productos, no cargar de nuevo

        # Cargar JSON de productos
        # Obtener la ruta del directorio actual
        current_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(current_dir)
        json_file = os.path.join(backend_dir, "productos.json")
        
        with open(json_file, "r", encoding="utf-8") as f:
            productos_data = json.load(f)

        # Insertar productos iniciales
        for item in productos_data:
            producto = Producto(**item)
            session.add(producto)

        session.commit()