import uvicorn
from fastapi import FastAPI, Path, Query
from pydantic import BaseModel, Field, EmailStr

app = FastAPI()

# Modelo para el contacto 
# DTO: Data Transfer Object

class ContactoNuevo(BaseModel):
    nombre: str = Field(..., description="Nombre del contacto", min_length=3)
    apellido: str = Field(..., description="Apellido del contacto", min_length=3)
    email: EmailStr = Field(..., description="Email del contacto")

#https://127.0.0.1:8000/

contactos = [
    {"id": 1, "nombre": "Ana", "apellido": "Artigas", "email": "ana.artigas@example.com"},
    {"id": 2, "nombre": "Belen", "apellido": "Benitez", "email": "belen.benitez@example.com"},
    {"id": 3, "nombre": "Carlos", "apellido": "Cruz", "email": "carlos.cruz@example.com"},
    {"id": 4, "nombre": "Diana", "apellido": "Duarte", "email": "diana.duarte@example.com"},
    {"id": 5, "nombre": "Eduardo", "apellido": "Escobar", "email": "eduardo.escobar@example.com"}
]
    
@app.get("/")
def saludar():
    return {"hola": "mundo"}

@app.get("/contactos/{id}") # READ
def leer_contacto(id: int = Path(..., description="ID del contacto a obtener", gt=0)):
    
    for item in contactos:
        if item["id"] == id:
            return {"contacto": item}
        
    return {"contacto": None}


@app.get("/contactos") # READ_ALL (con filtro)
def buscar_contactos(
    texto: str = Query(..., description="Texto a buscar en nombre o apellido", min_length=2)):
    
    resultados = []
    for item in contactos:
        if texto.lower() in item["nombre"].lower() or texto.lower() in item["apellido"].lower():
            resultados.append(item)
            
    return {"contactos": resultados}

@app.post("/agregar")       # CREATE
def agregar_contacto(contacto: ContactoNuevo):
    
    """ Agrega un nuevo contacto a la lista. Recibe los datos en el body como JSON. """
    
    nuevo_id = max([c["id"] for c in contactos]) + 1 if contactos else 1
    nuevo_contacto = {
        "id": nuevo_id, 
        "nombre": contacto.nombre, 
        "apellido": contacto.apellido, 
        "email": contacto.email
    }
    contactos.append(nuevo_contacto)
    
    return {"mensaje": "Contacto agregado", "contacto": nuevo_contacto}

@app.delete("/contactos/{id}")  # DELETE
def eliminar_contacto(id: int = Path(..., description="ID del contacto a eliminar", gt=0)):
    
    """ Elimina un contacto por su ID. """
    
    for index, item in enumerate(contactos):
        if item["id"] == id:
            contactos.pop(index)
            return {"mensaje": "Contacto eliminado"}
    
    return {"mensaje": "Contacto no encontrado"}
@app.get("/contactos/")
def listar_contactos():
    return {"contactos": contactos}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)