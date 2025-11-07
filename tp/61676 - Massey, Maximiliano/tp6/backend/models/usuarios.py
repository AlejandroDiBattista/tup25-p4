from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime

class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    email: str = Field(unique=True)
    password_hash: str
    compras: List["Compra"] = Relationship(back_populates="usuario")
    carrito: Optional["Carrito"] = Relationship(back_populates="usuario")