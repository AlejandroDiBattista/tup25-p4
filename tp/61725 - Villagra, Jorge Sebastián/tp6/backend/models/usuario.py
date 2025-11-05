

from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:  # avoid circular imports at runtime
    from .carrito import Carrito
    from .compra import Compra


class Usuario(SQLModel, table=True):
    """Entidad que representa a un usuario autenticable."""

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=120)
    email: str = Field(max_length=255, unique=True, index=True)
    password_hash: str = Field(max_length=255)

    carritos: list["Carrito"] = Relationship(
        back_populates="usuario",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    compras: list["Compra"] = Relationship(back_populates="usuario")
