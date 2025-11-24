from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship


# ============================================================
# BASE MODEL
# ============================================================
class BaseTable(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)


# ============================================================
# PRODUCTO
# ============================================================
class Producto(BaseTable, table=True):
    __tablename__ = "productos"

    nombre: str = Field(index=True)   # <--- antes era "titulo"
    descripcion: str
    precio: float
    categoria: str = Field(index=True)
    existencia: int
    valoracion: float
    imagen: str

    # Relaciones
    items_carrito: List["ItemCarrito"] = Relationship(back_populates="producto")
    items_compra: List["ItemCompra"] = Relationship(back_populates="producto")


# ============================================================
# USUARIO
# ============================================================
class Usuario(BaseTable, table=True):
    __tablename__ = "usuarios"

    nombre: str
    email: str = Field(unique=True, index=True)
    hashed_password: str

    # Relaciones
    carritos: List["Carrito"] = Relationship(back_populates="usuario")
    compras: List["Compra"] = Relationship(back_populates="usuario")


# ============================================================
# ITEM CARRITO
# ============================================================
class ItemCarrito(SQLModel, table=True):
    __tablename__ = "items_carrito"

    carrito_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="carritos.id")
    producto_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="productos.id")

    cantidad: int = Field(default=1, gt=0)

    carrito: "Carrito" = Relationship(back_populates="items_carrito")
    producto: Producto = Relationship(back_populates="items_carrito")


# ============================================================
# CARRITO
# ============================================================
class Carrito(BaseTable, table=True):
    __tablename__ = "carritos"

    usuario_id: int = Field(foreign_key="usuarios.id", index=True)
    estado: str = Field(default="activo")

    usuario: Usuario = Relationship(back_populates="carritos")
    items_carrito: List[ItemCarrito] = Relationship(back_populates="carrito")


# ============================================================
# ITEM COMPRA
# ============================================================
class ItemCompra(SQLModel, table=True):
    __tablename__ = "items_compra"

    compra_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="compras.id")
    producto_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="productos.id")

    cantidad: int
    nombre: str
    precio_unitario: float

    compra: "Compra" = Relationship(back_populates="items_compra")
    producto: Producto = Relationship(back_populates="items_compra")


# ============================================================
# COMPRA
# ============================================================
class Compra(BaseTable, table=True):
    __tablename__ = "compras"

    usuario_id: int = Field(foreign_key="usuarios.id")
    fecha: str
    direccion: str
    tarjeta: str
    total: float
    envio: float

    usuario: Usuario = Relationship(back_populates="compras")
    items_compra: List[ItemCompra] = Relationship(back_populates="compra")


# ============================================================
# SCHEMAS (DTOs) — PARA RESPUESTAS DEL API
# ============================================================

class ProductoRead(SQLModel):
    id: int
    nombre: str
    descripcion: str
    precio: float
    categoria: str
    existencia: int
    imagen: str


class ItemCarritoRead(SQLModel):
    producto_id: int
    nombre: str
    precio: float
    cantidad: int
    imagen: str


class ItemCompraRead(SQLModel):
    nombre: str
    cantidad: int
    precio_unitario: float


class CompraRead(SQLModel):
    id: int
    fecha: str
    direccion: str
    tarjeta: str
    total: float
    envio: float
    items: List[ItemCompraRead]


class UsuarioCreate(SQLModel):
    nombre: str
    email: str
    password: str


class UsuarioRead(SQLModel):
    id: int
    nombre: str
    email: str


class LoginData(SQLModel):
    email: str
    password: str


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"