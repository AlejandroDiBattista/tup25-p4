from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, create_engine, Session, select
import json
from pathlib import Path
from models import Producto

DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, echo=False)

app = FastAPI(title="API Productos")

app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def inicializar_base_datos():
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        resultado = session.exec(select(Producto)).first()
        if not resultado:
            ruta_productos = Path(__file__).parent / "productos.json"
            with open(ruta_productos, "r", encoding="utf-8") as archivo:
                productos_data = json.load(archivo)
            
            for producto_data in productos_data:
                producto = Producto(**producto_data)
                session.add(producto)
            
            session.commit()

@app.on_event("startup")
def on_startup():
    inicializar_base_datos()

@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}

@app.get("/productos")
def obtener_productos():
    with Session(engine) as session:
        productos = session.exec(select(Producto)).all()
        return productos

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
