from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from database import engine

app = FastAPI(title="API Productos")

# Configurar CORS para permitir la comunicación con el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Origen de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_db_and_tables():
    """Crea las tablas en la base de datos."""
    SQLModel.metadata.create_all(engine)

@app.on_event("startup")
def on_startup():
    """Se ejecuta al iniciar la aplicación para crear la base de datos y las tablas."""
    create_db_and_tables()

@app.get("/")
def root():
    """Endpoint raíz para verificar que la API está funcionando."""
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}
