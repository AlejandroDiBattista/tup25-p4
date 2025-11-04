from sqlmodel import SQLModel, Field
from typing import Optional


class ProductoRead(SQLModel):
    id: Optional[int]
    nombre: str
    descripcion: str
    precio: float
    categoria: str
    existencia: int
    agotado: Optional[bool] = None