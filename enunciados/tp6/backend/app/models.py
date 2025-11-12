from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    email: str = Field(unique=True)
    password: str

    compras: List["Compra"] = Relationship(back_populates="usuario")


class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    categoria: str
    precio: float
    stock: int
    imagen: Optional[str]
    tipo_iva: str  # 'general' (21%) o 'reducido' (10%)
    descripcion: Optional[str]


class CarritoItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int

    producto: Optional[Producto] = Relationship()
    usuario: Optional[User] = Relationship()


class Compra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    total: float
    direccion: str
    detalles_pago: str

    usuario: Optional[User] = Relationship(back_populates="compras")