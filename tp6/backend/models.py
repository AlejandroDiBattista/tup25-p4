from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from pydantic import EmailStr

# Modelo Usuario
class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    email: EmailStr = Field(unique=True)
    contraseña: str  # Será hasheada
    fecha_creacion: datetime = Field(default_factory=datetime.utcnow)
    
    # Relaciones
    carritos: List["Carrito"] = Relationship(back_populates="usuario")
    compras: List["Compra"] = Relationship(back_populates="usuario")


# Modelo Producto
class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    descripcion: str
    precio: float
    categoria: str
    existencia: int
    imagen_url: Optional[str] = None
    es_electronico: bool = False  # Para calcular IVA diferente
    
    # Relaciones
    items_carrito: List["ItemCarrito"] = Relationship(back_populates="producto")
    items_compra: List["ItemCompra"] = Relationship(back_populates="producto")


# Modelo ItemCarrito (tabla de relación many-to-many con cantidad)
class ItemCarrito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    carrito_id: int = Field(foreign_key="carrito.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int
    
    # Relaciones
    carrito: Optional["Carrito"] = Relationship(back_populates="items")
    producto: Optional["Producto"] = Relationship(back_populates="items_carrito")


# Modelo Carrito
class Carrito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    estado: str = "activo"  # activo, finalizado, cancelado
    fecha_creacion: datetime = Field(default_factory=datetime.utcnow)
    
    # Relaciones
    usuario: Optional["Usuario"] = Relationship(back_populates="carritos")
    items: List["ItemCarrito"] = Relationship(back_populates="carrito", cascade_delete=True)


# Modelo ItemCompra (tabla de relación many-to-many para compras)
class ItemCompra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    compra_id: int = Field(foreign_key="compra.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int
    nombre: str
    precio_unitario: float
    
    # Relaciones
    compra: Optional["Compra"] = Relationship(back_populates="items")
    producto: Optional["Producto"] = Relationship(back_populates="items_compra")


# Modelo Compra
class Compra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    fecha: datetime = Field(default_factory=datetime.utcnow)
    direccion: str
    tarjeta: str  # En producción, nunca guardar datos sensibles así
    subtotal: float
    iva: float
    envio: float
    total: float
    
    # Relaciones
    usuario: Optional["Usuario"] = Relationship(back_populates="compras")
    items: List["ItemCompra"] = Relationship(back_populates="compra", cascade_delete=True)
