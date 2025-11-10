from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship


class Usuario(SQLModel, table=True):
id: Optional[int] = Field(default=None, primary_key=True)
nombre: str = Field(index=True)
email: str = Field(unique=True, index=True)
password: str


carritos: list["Carrito"] = Relationship(back_populates="usuario")
compras: list["Compra"] = Relationship(back_populates="usuario")


class Producto(SQLModel, table=True):
id: Optional[int] = Field(default=None, primary_key=True)
nombre: str = Field(index=True)
descripcion: str
precio: float
categoria: str = Field(index=True)
existencia: int
imagen: Optional[str] = None
valoracion: Optional[float] = None


items_carrito: list["ItemCarrito"] = Relationship(back_populates="producto")
items_compra: list["ItemCompra"] = Relationship(back_populates="producto")


class Carrito(SQLModel, table=True):
id: Optional[int] = Field(default=None, primary_key=True)
usuario_id: int = Field(foreign_key="usuario.id")
estado: str # "abierto" | "finalizado" | "cancelado"


usuario: Usuario = Relationship(back_populates="carritos")
items: list["ItemCarrito"] = Relationship(back_populates="carrito")


class ItemCarrito(SQLModel, table=True):
id: Optional[int] = Field(default=None, primary_key=True)
cantidad: int
carrito_id: int = Field(foreign_key="carrito.id")
producto_id: int = Field(foreign_key="producto.id")


carrito: Carrito = Relationship(back_populates="items")
producto: Producto = Relationship(back_populates="items_carrito")


class Compra(SQLModel, table=True):
id: Optional[int] = Field(default=None, primary_key=True)
usuario_id: int = Field(foreign_key="usuario.id")
fecha: datetime
direccion: str
tarjeta: str
total: float
envio: float


usuario: Usuario = Relationship(back_populates="compras")
items: list["ItemCompra"] = Relationship(back_populates="compra")


class ItemCompra(SQLModel, table=True):
id: Optional[int] = Field(default=None, primary_key=True)
cantidad: int
nombre: str
precio_unitario: float
compra_id: int = Field(foreign_key="compra.id")
producto_id: int = Field(foreign_key="producto.id")


compra: Compra = Relationship(back_populates="items")
producto: Producto = Relationship(back_populates="items_compra")