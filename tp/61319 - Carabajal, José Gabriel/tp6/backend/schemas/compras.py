from pydantic import BaseModel
from typing import List

class CompraItemOut(BaseModel):
    producto_id: int
    nombre: str
    precio_unitario: float
    cantidad: int

class CompraOut(BaseModel):
    id: int
    fecha: str
    subtotal: float
    iva: float
    envio: float
    total: float
    items: List[CompraItemOut]
