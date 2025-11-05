

from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .usuario import Usuario
    from .productos import Producto


class Compra(SQLModel, table=True):
    """Registro de una compra finalizada."""

    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id", index=True)
    fecha: datetime = Field(default_factory=datetime.utcnow)
    direccion: str = Field(max_length=255)
    tarjeta: str = Field(max_length=32, description="Identificador de tarjeta enmascarado")
    total: float = Field(default=0.0, ge=0)
    envio: float = Field(default=0.0, ge=0)

    usuario: Optional["Usuario"] = Relationship(back_populates="compras")
    items: list["CompraItem"] = Relationship(
        back_populates="compra",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class CompraItem(SQLModel, table=True):
    """Detalle inmóvil de productos vendidos dentro de una compra."""

    id: Optional[int] = Field(default=None, primary_key=True)
    compra_id: int = Field(foreign_key="compra.id", index=True)
    producto_id: int = Field(foreign_key="producto.id", index=True)
    nombre: str = Field(max_length=255)
    cantidad: int = Field(default=1, ge=1)
    precio_unitario: float = Field(default=0.0, ge=0)

    compra: Optional[Compra] = Relationship(back_populates="items")
    producto: Optional["Producto"] = Relationship()
