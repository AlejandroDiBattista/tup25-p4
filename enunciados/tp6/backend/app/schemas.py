from pydantic import BaseModel
from typing import Optional, List

class UserCreate(BaseModel):
    nombre: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ProductoBase(BaseModel):
    nombre: str
    categoria: str
    precio: float
    stock: int
    descripcion: Optional[str] = None
    imagen: Optional[str] = None

class ProductoOut(ProductoBase):
    id: int
    class Config:
        from_attributes = True

class CarritoItem(BaseModel):
    producto_id: int
    cantidad: int

class CompraOut(BaseModel):
    id: int
    total: float
    detalle: list
    fecha: str
    class Config:
        from_attributes = True