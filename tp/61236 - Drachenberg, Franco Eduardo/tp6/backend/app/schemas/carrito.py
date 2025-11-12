from pydantic import BaseModel


class ItemCarritoRead(BaseModel):
    producto_id: int
    nombre: str
    precio: float
    cantidad: int
    subtotal: float


class CarritoRead(BaseModel):
    id: int
    estado: str
    total: float
    items: list[ItemCarritoRead]
