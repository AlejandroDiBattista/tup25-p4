from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class ItemCompra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    compra_id: int = Field(foreign_key="compra.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int
    nombre: str  # Guardamos el nombre por si el producto cambia en el futuro
    precio_unitario: float
    compra: "Compra" = Relationship(back_populates="items")
    producto: "Producto" = Relationship(back_populates="items_compra")

class Compra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    fecha: datetime = Field(default_factory=datetime.utcnow)
    direccion: str
    tarjeta: str  # Últimos 4 dígitos
    total: float
    envio: float
    usuario: "Usuario" = Relationship(back_populates="compras")
    items: List[ItemCompra] = Relationship(back_populates="compra")