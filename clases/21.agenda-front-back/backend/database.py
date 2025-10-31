from collections.abc import Generator
from sqlmodel import Session, SQLModel, create_engine

DATABASE_URL = "sqlite:///./contacts.db"

engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False}
)


def create_db_and_tables() -> None:
    """Crear las tablas en la base de datos"""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Dependencia para obtener una sesión de base de datos"""
    with Session(engine) as session:
        yield session
