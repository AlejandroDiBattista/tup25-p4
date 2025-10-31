from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from database import create_db_and_tables, get_session
from schemas import ContactCreate, ContactList, ContactRead, ContactUpdate
from services import ContactService

app = FastAPI(title="Agenda de Contactos API")

# Configurar CORS para permitir conexiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    """Crear las tablas al iniciar la aplicación"""
    create_db_and_tables()


@app.get("/")
def read_root() -> dict[str, str]:
    """Endpoint raíz"""
    return {"message": "API de Agenda de Contactos"}


@app.get("/api/contacts", response_model=ContactList)
def list_contacts(
    session: Annotated[Session, Depends(get_session)],
    search: str | None = None,
) -> ContactList:
    """Listar contactos con búsqueda opcional"""
    contacts = ContactService.get_contacts(session, search)
    return ContactList(
        contacts=[ContactRead.model_validate(c) for c in contacts],
        total=len(contacts)
    )


@app.get("/api/contacts/{contact_id}", response_model=ContactRead)
def get_contact(
    contact_id: int,
    session: Annotated[Session, Depends(get_session)],
) -> ContactRead:
    """Obtener un contacto por ID"""
    contact = ContactService.get_contact(session, contact_id)
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contacto no encontrado"
        )
    return ContactRead.model_validate(contact)


@app.post("/api/contacts", response_model=ContactRead, status_code=status.HTTP_201_CREATED)
def create_contact(
    contact_data: ContactCreate,
    session: Annotated[Session, Depends(get_session)],
) -> ContactRead:
    """Crear un nuevo contacto"""
    try:
        contact = ContactService.create_contact(session, contact_data)
        return ContactRead.model_validate(contact)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear el contacto: {e!s}"
        ) from e


@app.put("/api/contacts/{contact_id}", response_model=ContactRead)
def update_contact(
    contact_id: int,
    contact_data: ContactUpdate,
    session: Annotated[Session, Depends(get_session)],
) -> ContactRead:
    """Actualizar un contacto existente"""
    contact = ContactService.update_contact(session, contact_id, contact_data)
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contacto no encontrado"
        )
    return ContactRead.model_validate(contact)


@app.delete("/api/contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    contact_id: int,
    session: Annotated[Session, Depends(get_session)],
) -> None:
    """Eliminar un contacto"""
    success = ContactService.delete_contact(session, contact_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contacto no encontrado"
        )
