from typing import Generator
from sqlmodel import create_engine, SQLModel, Session

# Usaremos SQLite con un archivo llamado 'database.db'
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# Configuración del motor (engine)
# El echo=True imprime las consultas SQL generadas (útil para debug)
engine = create_engine(sqlite_url, echo=True)

def create_db_and_tables():
    """Crea la base de datos y todas las tablas definidas en models.py."""
    # SQLModel ya conoce todas las tablas importadas en main.py
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """Dependencia que provee una sesión de base de datos para los endpoints."""
    with Session(engine) as session:
        yield session