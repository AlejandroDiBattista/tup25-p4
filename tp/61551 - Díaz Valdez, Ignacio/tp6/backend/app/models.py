"""Modelos SQLModel (FASE 2) con relaciones simétricas correctamente declaradas.

Se corrige el error anterior:
    Mapper 'Mapper[CompraItem(compraitem)]' has no property 'compra'
causado por asignar la relación fuera de la clase (`CompraItem.compra = Relationship(...)`).

Reglas usadas:
 - Cada Relationship con back_populates debe tener su contraparte declarada dentro de la clase.
 - Forward references se escriben como cadenas ("Tipo") donde hace falta.
"""

from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    nombre: str = ""
    password_hash: str
    # Relaciones
    compras: List["Compra"] = Relationship(back_populates="usuario")
    carrito: Optional["Carrito"] = Relationship(back_populates="usuario")

class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    precio: float
    descripcion: str = ""
    categoria: str = ""
    valoracion: float = 0
    existencia: int = 0
    imagen: str = ""

class Carrito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id", unique=True)
    # items referencian vuelve con carrito
    items: List["CarritoItem"] = Relationship(back_populates="carrito")
    usuario: Optional[Usuario] = Relationship(back_populates="carrito")

class CarritoItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    producto_id: int = Field(foreign_key="producto.id")
    carrito_id: int = Field(foreign_key="carrito.id")
    cantidad: int = 1
    # Relaciones simétricas
    carrito: Optional[Carrito] = Relationship(back_populates="items")
    producto: Optional[Producto] = Relationship()

class Compra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    total: float = 0
    usuario: Optional[Usuario] = Relationship(back_populates="compras")
    items: List["CompraItem"] = Relationship(back_populates="compra")

class CompraItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    compra_id: int = Field(foreign_key="compra.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int = 1
    precio_unitario: float
    # Relaciones simétricas
    compra: Optional[Compra] = Relationship(back_populates="items")
    producto: Optional[Producto] = Relationship()
