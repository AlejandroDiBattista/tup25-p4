from typing import Optional
from sqlmodel import Field, SQLModel, Relationship


class Producto(SQLModel, table=True):
    #Modelo de Producto.
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(default="", max_length=255)
    descripcion: str = Field(default="")
    precio: float = Field(default=0.0, ge=0)
    categoria: str = Field(default="", max_length=100)
    existencia: int = Field(default=0, ge=0)

    items_carrito: list["ItemCarrito"] = Relationship(back_populates="producto")
    items_compra: list["ItemCompra"] = Relationship(back_populates="producto")