from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime

class CarritoItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    carrito_id: int = Field(foreign_key="carrito.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int
    carrito: "Carrito" = Relationship(back_populates="items")

class Carrito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    estado: str  # "activo", "completado", "cancelado"
    usuario: "Usuario" = Relationship(back_populates="carrito")
    items: List[CarritoItem] = Relationship(back_populates="carrito")