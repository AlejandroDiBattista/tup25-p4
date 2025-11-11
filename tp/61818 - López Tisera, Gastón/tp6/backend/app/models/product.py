from typing import Optional

from sqlmodel import Field, SQLModel


class Product(SQLModel, table=True):
    """Product catalogue entry."""

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=255)
    descripcion: str
    precio: float = Field(ge=0)
    categoria: str = Field(max_length=100)
    existencia: int = Field(ge=0)

