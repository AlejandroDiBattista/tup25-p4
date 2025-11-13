from typing import Optional
from sqlmodel import Field, SQLModel
from __future__ import annotations
from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

# USER
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    email: str = Field(sa_column_kwargs={"unique": True, "index": True})
    hashed_password: str

    carts: List["Cart"] = Relationship(back_populates="user")
    purchases: List["Purchase"] = Relationship(back_populates="user")

# PRODUCT
class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    categoria: str
    existencia: int
    imagen: Optional[str] = None

# CART ITEM
class CartItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    cart_id: Optional[int] = Field(default=None, foreign_key="cart.id")
    product_id: Optional[int] = Field(default=None, foreign_key="product.id")
    cantidad: int

    product: Optional[Product] = Relationship()

class Producto(SQLModel, table=True):
    """Modelo de Producto para la base de datos.
    
    TODO: Implementar los campos necesarios según las especificaciones.
    """
# CART
class Cart(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(default="", max_length=255)
    descripcion: str = Field(default="")
    precio: float = Field(default=0.0, ge=0)
    categoria: str = Field(default="", max_length=100)
    existencia: int = Field(default=0, ge=0)     usuario_id: Optional[int] = Field(default=None, foreign_key="user.id")
    estado: str = Field(default="open")  # open | finalized | cancelled

    items: List[CartItem] = Relationship()
    user: Optional[User] = Relationship(back_populates="carts")

# PURCHASE ITEM
class PurchaseItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    purchase_id: Optional[int] = Field(default=None, foreign_key="purchase.id")
    producto_id: int
    cantidad: int
    nombre: str
    precio_unitario: float

# PURCHASE
class Purchase(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="user.id")
    fecha: datetime = Field(default_factory=datetime.utcnow)
    direccion: str
    tarjeta: str
    total: float
    envio: float

    items: List[PurchaseItem] = Relationship()
    user: Optional[User] = Relationship(back_populates="purchases")
