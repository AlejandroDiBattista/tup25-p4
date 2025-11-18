from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# Esquemas para Usuario
class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr


class UsuarioCreate(UsuarioBase):
    contraseña: str


class UsuarioResponse(UsuarioBase):
    id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True


# Esquemas para Producto
class ProductoBase(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    categoria: str
    existencia: int
    imagen_url: Optional[str] = None
    es_electronico: bool = False


class ProductoCreate(ProductoBase):
    pass


class ProductoResponse(ProductoBase):
    id: int

    class Config:
        from_attributes = True


# Esquemas para ItemCarrito
class ItemCarritoBase(BaseModel):
    producto_id: int
    cantidad: int


class ItemCarritoResponse(ItemCarritoBase):
    id: int
    carrito_id: int
    producto: Optional[ProductoResponse] = None

    class Config:
        from_attributes = True


# Esquemas para Carrito
class CarritoBase(BaseModel):
    pass


class CarritoCreate(CarritoBase):
    pass


class CarritoResponse(CarritoBase):
    id: int
    usuario_id: int
    estado: str
    fecha_creacion: datetime
    items: List[ItemCarritoResponse] = []

    class Config:
        from_attributes = True


class CarritoConTotales(CarritoResponse):
    subtotal: float
    iva: float
    envio: float
    total: float


# Esquemas para ItemCompra
class ItemCompraBase(BaseModel):
    producto_id: int
    cantidad: int
    nombre: str
    precio_unitario: float


class ItemCompraResponse(ItemCompraBase):
    id: int
    compra_id: int

    class Config:
        from_attributes = True


# Esquemas para Compra
class CompraBase(BaseModel):
    direccion: str
    tarjeta: str


class CompraCreate(CompraBase):
    pass


class CompraResponse(CompraBase):
    id: int
    usuario_id: int
    fecha: datetime
    subtotal: float
    iva: float
    envio: float
    total: float
    items: List[ItemCompraResponse] = []

    class Config:
        from_attributes = True


# Esquemas para autenticación
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    usuario: UsuarioResponse


class LoginRequest(BaseModel):
    email: EmailStr
    contraseña: str
