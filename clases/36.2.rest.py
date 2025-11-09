
## API Rest (Resources : contactos)

## POST /contactos          -> Crear nuevo contacto -> CREATE
## GET /contactos           -> Todos los contactos  -> READ_ALL
## GET /contactos/{id}      -> Contacto por ID      -> READ
## PUT /contactos/{id}      -> Actualizar contacto  -> UPDATE
## DELETE /contactos/{id}   -> Eliminar contacto    -> DELETE

## GET /contactos/buscar      -> Buscar contactos     -> READ_ALL(filtrado)
## DELETE /contactos        -> Vaciar lista        -> DELETE_ALL
## DELETE /contactos/menores -> Eliminar contactos menores de edad -> DELETE_ALL(condicional)


from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy import or_, func
from sqlmodel import SQLModel, Field, create_engine, Session, select


# Modelo de base de datos
class Contacto(SQLModel, table=True):
    id: Optional[int]   = Field(default=None, primary_key=True)
    nombre: str         = Field(index=True)
    apellido: str       = Field(index=True)
    email: str          = Field(unique=True, index=True)
    telefono: Optional[str] = None


# Modelo para crear contacto (sin ID) #DTO 
class ContactoCreate(SQLModel):
    nombre: str
    apellido: str
    email: str
    telefono: Optional[str] = None


# Modelo para actualizar contacto
class ContactoUpdate(SQLModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None


# Configuración de base de datos
DATABASE_URL = "sqlite:///contactos.db"
engine = create_engine(DATABASE_URL, echo=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crear tablas al iniciar
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(
    title="API de Contactos",
    description="API REST para gestión de contactos usando FastAPI y SQLModel",
    version="1.0.0",
    lifespan=lifespan
)

# Dependencia para obtener sesión de DB
def get_session():
    with Session(engine) as session:
        yield session


@app.get("/")
def read_root():
    return {"message": "API de Contactos - FastAPI + SQLModel"}


# CREATE - Crear un nuevo contacto
@app.post("/contactos/", response_model=Contacto)
def crear_contacto(contacto: ContactoCreate, session: Session = Depends(get_session)):
    """Crear un nuevo contacto"""
    # Verificar si el email ya existe
    db_contacto = session.exec(select(Contacto).where(Contacto.email == contacto.email)).first()
    if db_contacto:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    # Crear nuevo contacto
    db_contacto = Contacto(**contacto.model_dump())
    session.add(db_contacto)
    session.commit()
    session.refresh(db_contacto)
    return db_contacto


# READ ALL - Obtener todos los contactos
#GET /contactos/q=ana&limit=10&skip=5
@app.get("/contactos/", response_model=List[Contacto])
def listar_contactos(
    skip: int = 0,
    limit: int = 100,
    q: Optional[str] = Query(None, description="Texto a buscar en nombre o apellido"),
    
    session: Session = Depends(get_session)
):
    """Listar todos los contactos con paginación"""
    cmd = select(Contacto).offset(skip).limit(limit)
    contactos = session.exec(cmd).all()
    return contactos


# READ - Obtener un contacto por ID
@app.get("/contactos/{contacto_id}", response_model=Contacto)
def obtener_contacto(contacto_id: int, session: Session = Depends(get_session)):
    """Obtener un contacto específico por ID"""
    contacto = session.get(Contacto, contacto_id)
    if not contacto:
        raise HTTPException(status_code=404, detail="Contacto no encontrado")
    return contacto


# UPDATE - Actualizar un contacto
@app.put("/contactos/{contacto_id}", response_model=Contacto)
def actualizar_contacto(
    contacto_id: int,
    contacto_update: ContactoUpdate,
    
    session: Session = Depends(get_session)
):
    """Actualizar un contacto existente"""
    contacto = session.get(Contacto, contacto_id)
    if not contacto:
        raise HTTPException(status_code=404, detail="Contacto no encontrado")

    # Verificar si el email ya existe en otro contacto
    if contacto_update.email:
        existing_contacto = session.exec(
            select(Contacto).where(Contacto.email == contacto_update.email)
        ).first()
        if existing_contacto and existing_contacto.id != contacto_id:
            raise HTTPException(status_code=400, detail="Email ya registrado")

    # Actualizar campos
    update_data = contacto_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(contacto, field, value)

    session.add(contacto)
    session.commit()
    session.refresh(contacto)
    return contacto


# DELETE - Eliminar un contacto
@app.delete("/contactos/{contacto_id}")
def eliminar_contacto(contacto_id: int, session: Session = Depends(get_session)):
    """Eliminar un contacto"""
    contacto = session.get(Contacto, contacto_id)
    if not contacto:
        raise HTTPException(status_code=404, detail="Contacto no encontrado")

    session.delete(contacto)
    session.commit()
    return {"message": "Contacto eliminado exitosamente"}


# Búsqueda por nombre o apellido
@app.get("/contactos/buscar/", response_model=List[Contacto])
def buscar_contactos(
    q: str,
    
    session: Session = Depends(get_session)
):
    """Buscar contactos por nombre o apellido"""
    # Búsqueda case insensitive
    q_lower = q.lower()
    contactos = session.exec(
        select(Contacto).where(
            or_(
                func.lower(Contacto.nombre).like(f"%{q_lower}%"),
                func.lower(Contacto.apellido).like(f"%{q_lower}%")
            )
        )
    ).all()
    return contactos


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("rest:app", host="127.0.0.1", port=8000, reload=True)