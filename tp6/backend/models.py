from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from pydantic import EmailStr

class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    email: EmailStr = Field(unique=True, index=True)
    contraseña: str
    fecha_creacion: datetime = Field(default_factory=datetime.utcnow)
    
    carritos: List["Carrito"] = Relationship(back_populates="usuario")
    compras: List["Compra"] = Relationship(back_populates="usuario")


class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    descripcion: str
    precio: float
    categoria: str = Field(index=True)
    existencia: int
    imagen_url: Optional[str] = None
    es_electronico: bool = False
    
    items_carrito: List["ItemCarrito"] = Relationship(back_populates="producto")
    items_compra: List["ItemCompra"] = Relationship(back_populates="producto")


class Carrito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    estado: str = Field(default="activo")
    fecha_creacion: datetime = Field(default_factory=datetime.utcnow)
    
    usuario: Optional["Usuario"] = Relationship(back_populates="carritos")
    items: List["ItemCarrito"] = Relationship(back_populates="carrito")


class ItemCarrito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    carrito_id: int = Field(foreign_key="carrito.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int = Field(gt=0)
    
    carrito: Optional["Carrito"] = Relationship(back_populates="items")
    producto: Optional["Producto"] = Relationship(back_populates="items_carrito")


class Compra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    fecha: datetime = Field(default_factory=datetime.utcnow)
    direccion: str
    tarjeta: str
    subtotal: float
    iva: float
    envio: float
    total: float
    
    usuario: Optional["Usuario"] = Relationship(back_populates="compras")
    items: List["ItemCompra"] = Relationship(back_populates="compra")


class ItemCompra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    compra_id: int = Field(foreign_key="compra.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int = Field(gt=0)
    nombre: str
    precio_unitario: float
    
    compra: Optional["Compra"] = Relationship(back_populates="items")
    producto: Optional["Producto"] = Relationship(back_populates="items_compra")

