from datetime import datetime
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel


# --- Modelos de Producto ---

class ProductoBase(SQLModel):
    titulo: str
    precio: float
    descripcion: str
    categoria: str
    imagen: str
    existencia: int = Field(default=5)
    valoracion: float = Field(default=0.0)

class Producto(ProductoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    items_carrito: List["ItemCarrito"] = Relationship(back_populates="producto")
    items_compra: List["ItemCompra"] = Relationship(back_populates="producto")

class ProductoRead(ProductoBase):
    id: int


# --- Modelos de Usuario ---

class UsuarioBase(SQLModel):
    nombre: str
    email: str = Field(unique=True, index=True)

class Usuario(UsuarioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str
    carritos: List["Carrito"] = Relationship(back_populates="usuario")
    compras: List["Compra"] = Relationship(back_populates="usuario")

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioRead(UsuarioBase):
    id: int


# --- Modelos de Carrito ---

class ItemCarritoBase(SQLModel):
    cantidad: int
    producto_id: int = Field(foreign_key="producto.id")
    carrito_id: int = Field(foreign_key="carrito.id")

class ItemCarrito(ItemCarritoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    producto: Producto = Relationship(back_populates="items_carrito")
    carrito: "Carrito" = Relationship(back_populates="items")

class ItemCarritoCreate(SQLModel):
    producto_id: int
    cantidad: int

class ItemCarritoRead(SQLModel):
    producto: ProductoRead
    cantidad: int

class CarritoBase(SQLModel):
    usuario_id: int = Field(foreign_key="usuario.id", unique=True)

class Carrito(CarritoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario: Usuario = Relationship(back_populates="carritos")
    items: List[ItemCarrito] = Relationship(back_populates="carrito")

class CarritoRead(SQLModel):
    items: List[ItemCarritoRead]
    subtotal: float
    costo_envio: float
    iva: float
    total: float


# --- Modelos de Compra ---

class ItemCompraBase(SQLModel):
    cantidad: int
    nombre: str
    precio_unitario: float
    producto_id: int = Field(foreign_key="producto.id")
    compra_id: int = Field(foreign_key="compra.id")

class ItemCompra(ItemCompraBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    producto: Producto = Relationship(back_populates="items_compra")
    compra: "Compra" = Relationship(back_populates="items")

class ItemCompraRead(ItemCompraBase):
    id: int

class CompraBase(SQLModel):
    fecha: datetime = Field(default_factory=datetime.utcnow)
    direccion: str
    tarjeta: str
    total: float
    envio: float
    usuario_id: int = Field(foreign_key="usuario.id")

class Compra(CompraBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario: Usuario = Relationship(back_populates="compras")
    items: List[ItemCompra] = Relationship(back_populates="compra")

class CompraRead(CompraBase):
    id: int
    items: List[ItemCompraRead]
