from fastapi import FastAPI
import uvicorn
from typing import Union

app = FastAPI()
contactos = [
    {"id": 1, "nombre": "Ana", "apellido": "Artigas", "email": "ana.artigas@example.com"},
    {"id": 2, "nombre": "Belen", "apellido": "Benitez", "email": "belen.benitez@example.com"},
    {"id": 3, "nombre": "Carlos", "apellido": "Cruz", "email": "carlos.cruz@example.com"},
    {"id": 4, "nombre": "Diana", "apellido": "Duarte", "email": "diana.duarte@example.com"},
    {"id": 5, "nombre": "Eduardo", "apellido": "Escobar", "email": "eduardo.escobar@example.com"},
]

@app.get("/")
def saludar():
    return {"hola": "mundo"}

@app.get("/contactos/")
def listar_contactos():
    return {"contactos": contactos}


@app.get("/contacto/{id}")
def leer_contacto(id: int):
    contacto = next((item for item in contactos if item["id"] == id), None)
    return {"contacto": contacto}


@app.get("/buscar")
def buscar_contactos(texto: Union[str, None] = None):
    if texto is None:
        return {"resultados": contactos}
    resultados = [item for item in contactos if texto and texto.lower() in item["nombre"].lower()]
    return {"resultados": resultados}


@app.post("/contacto/")
def agregar_contacto(contacto: dict):
    contactos.append(contacto)
    return {"mensaje": "Contacto agregado", "contacto": contacto}


if __name__ == "__main__":
    uvicorn.run("servidor:app", host="127.0.0.1", port=8000, reload=True)