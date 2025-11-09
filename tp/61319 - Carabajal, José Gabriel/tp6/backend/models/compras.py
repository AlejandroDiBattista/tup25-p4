from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class CompraItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    compra_id: int = Field(index=True, foreign_key="compra.id")
    producto_id: int
    nombre: str
    precio_unitario: float
    cantidad: int

class Compra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(index=True)
    fecha: str
    direccion: str
    tarjeta: str
    subtotal: float
    iva: float
    envio: float
    total: float
    items: List[CompraItem] = Relationship(sa_relationship_kwargs={"cascade": "all, delete-orphan"})
