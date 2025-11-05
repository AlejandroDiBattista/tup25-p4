

from typing import Optional, TYPE_CHECKING  #sirve para evitar ejecuciones 

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:  # hints only
    from .usuario import Usuario
    from .productos import Producto


class Carrito(SQLModel, table=True):
    """Carrito activo asociado a un usuario."""

    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id", index=True)
    estado: str = Field(default="abierto", max_length=30)

    usuario: Optional["Usuario"] = Relationship(back_populates="carritos")
    items: list["CarritoItem"] = Relationship(
        back_populates="carrito",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class CarritoItem(SQLModel, table=True):
    """Detalle de productos incluidos en un carrito."""

    id: Optional[int] = Field(default=None, primary_key=True)
    carrito_id: int = Field(foreign_key="carrito.id", index=True)
    producto_id: int = Field(foreign_key="producto.id", index=True)
    cantidad: int = Field(default=1, ge=1)

    carrito: Optional[Carrito] = Relationship(back_populates="items")
    producto: Optional["Producto"] = Relationship()
