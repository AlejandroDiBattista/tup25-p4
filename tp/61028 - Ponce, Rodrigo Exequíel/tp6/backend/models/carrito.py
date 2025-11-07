from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class ItemCarrito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    carrito_id: int = Field(foreign_key="carrito.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int
    carrito: "Carrito" = Relationship(back_populates="items")
    producto: "Producto" = Relationship(back_populates="items_carrito")

class Carrito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    estado: str = Field(default="activo")  # activo, finalizado, cancelado
    fecha_creacion: datetime = Field(default_factory=datetime.utcnow)
    usuario: "Usuario" = Relationship(back_populates="carritos")
    items: List[ItemCarrito] = Relationship(back_populates="carrito")