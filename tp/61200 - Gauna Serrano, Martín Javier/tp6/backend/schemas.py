from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    nombre: str
    email: str
    password: str


class UserRead(BaseModel):
    id: int
    nombre: str
    email: str

    class Config:
        orm_mode = True


class ProductRead(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str]
    precio: float
    categoria: str
    existencia: int
    imagen: Optional[str]

    class Config:
        orm_mode = True


class AddToCart(BaseModel):
    product_id: int
    cantidad: int = 1


class FinalizeSchema(BaseModel):
    direccion: str
    tarjeta: str


class CartItemRead(BaseModel):
    product_id: int
    cantidad: int
    nombre: Optional[str]
    precio: Optional[float]


class CartRead(BaseModel):
    items: List[CartItemRead]
    subtotal: float
    iva: float
    envio: float
    total: float


class PurchaseItemRead(BaseModel):
    producto_id: int
    cantidad: int
    nombre: str
    precio_unitario: float


class PurchaseRead(BaseModel):
    id: int
    fecha: datetime
    direccion: str
    tarjeta: str
    total: float
    envio: float
    items: List[PurchaseItemRead]

    class Config:
        orm_mode = True
