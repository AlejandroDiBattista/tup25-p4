import json
from pathlib import Path
from sqlmodel import Session

from db import engine
from models import Producto


def cargar_productos_iniciales():
    ruta = Path(__file__).parent / "productos.json"

    with open(ruta, "r", encoding="utf-8") as f:
        datos = json.load(f)

    productos = []
    for p in datos:
        productos.append(
            Producto(
                id=p["id"],
                nombre=p["titulo"],
                descripcion=p["descripcion"],
                precio=p["precio"],
                categoria=p["categoria"],
                existencia=p["existencia"],
                imagen=p["imagen"],
                valoracion=p["valoracion"],
            )
        )

    with Session(engine) as session:
        session.add_all(productos)
        session.commit()

    print("✅ Productos iniciales cargados correctamente.")


if __name__ == "__main__":
    cargar_productos_iniciales()
