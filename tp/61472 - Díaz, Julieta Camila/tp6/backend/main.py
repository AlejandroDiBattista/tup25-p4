import json
from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import Session, select
from database import create_db_and_tables, engine
from models import Producto
from routes.productos import router as productos_router
from routes.auth import router as auth_router
from routes.carrito import router as carrito_router
from routes.compras import router as compras_router


def load_initial_products():
    with Session(engine) as session:
        exist = session.exec(select(Producto)).first()

        if not exist:
            print("Cargando productos iniciales...")
            with open("productos.json", "r", encoding="utf-8") as f:
                data = json.load(f)

            productos = []
            for item in data:
                p = Producto(
                    nombre=item["nombre"],
                    descripcion=item["descripcion"],
                    precio=item["precio"],
                    categoria=item["categoria"],
                    existencia=item["existencia"],
                    valoracion=item["valoracion"],
                    imagen=item["imagen"]
                )
                productos.append(p)

            session.add_all(productos)
            session.commit()
            print("Productos cargados.")
        else:
            print("Productos ya existen.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    load_initial_products()
    yield


app = FastAPI(title="API TP6", lifespan=lifespan)

app.include_router(productos_router)
app.include_router(auth_router)
app.include_router(carrito_router)
app.include_router(compras_router)


@app.get("/")
def root():
    return {"mensaje": "API funcionando"}