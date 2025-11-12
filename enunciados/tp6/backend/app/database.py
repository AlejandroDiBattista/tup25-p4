import os
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.ext.declarative import declarative_base

# Crea una ruta absoluta al archivo tienda.db dentro de esta carpeta
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "tienda.db")

DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, echo=True)
Base = declarative_base()

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
