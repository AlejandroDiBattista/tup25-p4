from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime

class CompraItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    compra_id: int = Field(foreign_key="compra.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int
    nombre: str  # Guardamos el nombre del producto al momento de la compra
    precio_unitario: float
    compra: "Compra" = Relationship(back_populates="items")

class Compra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    fecha: datetime = Field(default_factory=datetime.now)
    direccion: str
    tarjeta: str  # Últimos 4 dígitos
    total: float
    envio: float
    usuario: "Usuario" = Relationship(back_populates="compras")
    items: List[CompraItem] = Relationship(back_populates="compra")