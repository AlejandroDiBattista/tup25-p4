from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime

if TYPE_CHECKING:
    from .usuarios import ItemCarrito, ItemPedido

class Producto(SQLModel, table=True):
    """Modelo de Producto para la base de datos"""
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str = Field(max_length=255, index=True)
    precio: float = Field(ge=0)
    descripcion: str = Field(max_length=1000)
    categoria: str = Field(max_length=100, index=True)
    valoracion: Optional[float] = Field(default=None, ge=0, le=5)
    existencia: int = Field(default=0, ge=0)
    imagen: str = Field(max_length=255)
    
    # Relaciones
    items_carrito: List["ItemCarrito"] = Relationship(back_populates="producto")
    items_pedido: List["ItemPedido"] = Relationship(back_populates="producto")

class ProductoPublico(SQLModel):
    """Modelo público para respuestas de API"""
    id: int
    titulo: str
    precio: float
    descripcion: str
    categoria: str
    valoracion: Optional[float] = None
    existencia: int
    imagen: str

class ProductoFiltros(SQLModel):
    """Modelo para filtros de búsqueda de productos"""
    categoria: Optional[str] = None
    precio_min: Optional[float] = None
    precio_max: Optional[float] = None
    busqueda: Optional[str] = None
    ordenar_por: Optional[str] = Field(default="id", regex="^(id|titulo|precio|valoracion|existencia)$")
    orden: Optional[str] = Field(default="asc", regex="^(asc|desc)$") 