from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Carrito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id", index=True)
    estado: str = Field(default="abierto", max_length=20)  # abierto | finalizado | cancelado
    iva: float = Field(default=0.21, ge=0)
    envio: float = Field(default=0.0, ge=0)
    creado_en: datetime = Field(default_factory=datetime.utcnow)
    actualizado_en: datetime = Field(default_factory=datetime.utcnow)


class CarritoItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    carrito_id: int = Field(foreign_key="carrito.id", index=True)
    producto_id: int = Field(foreign_key="producto.id", index=True)
    cantidad: int = Field(default=1, ge=1)
    precio_unitario: float = Field(default=0.0, ge=0)
    creado_en: datetime = Field(default_factory=datetime.utcnow)