from pydantic import BaseModel, EmailStr


class PhoneBase(BaseModel):
    """DTO base para teléfonos"""
    number: str


class PhoneCreate(PhoneBase):
    """DTO para crear teléfonos"""
    pass


class PhoneRead(PhoneBase):
    """DTO para leer teléfonos"""
    id: int
    
    class Config:
        from_attributes = True


class ContactBase(BaseModel):
    """DTO base para contactos"""
    nombre: str
    apellido: str
    email: EmailStr


class ContactCreate(ContactBase):
    """DTO para crear contactos"""
    phones: list[str] = []


class ContactUpdate(ContactBase):
    """DTO para actualizar contactos"""
    phones: list[str] = []


class ContactRead(ContactBase):
    """DTO para leer contactos"""
    id: int
    phones: list[PhoneRead] = []
    
    class Config:
        from_attributes = True


class ContactList(BaseModel):
    """DTO para listar contactos"""
    contacts: list[ContactRead]
    total: int
