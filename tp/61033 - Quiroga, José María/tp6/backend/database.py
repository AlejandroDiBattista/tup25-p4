# backend/database.py
from sqlmodel import SQLModel, create_engine
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ecommerce.db")
# echo=True ayuda a debuggear SQL en consola; podés quitarlo luego
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, echo=False)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_engine():
    return engine
