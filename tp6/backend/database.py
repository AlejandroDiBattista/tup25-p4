from sqlmodel import create_engine, SQLModel, Session
from typing import Generator
import os

# Configuración de la base de datos
DATABASE_URL = "sqlite:///./tienda.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False  # Cambiar a True para ver las queries SQL
)


def create_db_and_tables():
    """Crea las tablas en la base de datos"""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Proporciona una sesión de base de datos para cada request"""
    with Session(engine) as session:
        yield session
