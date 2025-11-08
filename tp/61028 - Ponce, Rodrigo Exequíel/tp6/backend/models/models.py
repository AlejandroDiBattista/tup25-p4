from datetime import datetime
from typing import List, Optional, ForwardRef
from sqlmodel import SQLModel, Field, Relationship
from .productos import Producto

# Forward references para resolver dependencias circulares
ItemCarritoRef = ForwardRef("ItemCarrito")
ItemCompraRef = ForwardRef("ItemCompra")

# Añadir relaciones al modelo Producto
Producto.model_rebuild()
Producto.items_carrito = Relationship(back_populates="producto")
Producto.items_compra = Relationship(back_populates="producto")

class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    email: str = Field(unique=True)
    password_hash: str
    carritos: List["Carrito"] = Relationship(back_populates="usuario")
    compras: List["Compra"] = Relationship(back_populates="usuario")

class Carrito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    estado: str = Field(default="activo")  # activo, finalizado, cancelado
    usuario: Usuario = Relationship(back_populates="carritos")
    productos: List["ItemCarrito"] = Relationship(back_populates="carrito")

class ItemCarrito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    carrito_id: int = Field(foreign_key="carrito.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int
    carrito: Carrito = Relationship(back_populates="productos")
    producto: Producto = Relationship(back_populates="items_carrito")

class Compra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    fecha: datetime = Field(default_factory=datetime.now)
    direccion: str
    tarjeta: str
    total: float
    envio: float
    usuario: Usuario = Relationship(back_populates="compras")
    items: List["ItemCompra"] = Relationship(back_populates="compra")

class ItemCompra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    compra_id: int = Field(foreign_key="compra.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int
    nombre: str
    precio_unitario: float
    compra: Compra = Relationship(back_populates="items")
    producto: Producto = Relationship(back_populates="items_compra")