from typing import Optional

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel


class Producto(SQLModel, table=True):
    """Entidad de producto disponible para la venta."""

    model_config = ConfigDict(populate_by_name=True)  #el configdict sirve para que no haya que convertir claves y directamente usar titulo para todos los nombres de productos 

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(default="", max_length=255, alias="titulo")
    descripcion: str = Field(default="")
    precio: float = Field(default=0.0, ge=0)
    categoria: str = Field(default="", max_length=100)
    existencia: int = Field(default=0, ge=0)
    valoracion: Optional[float] = Field(default=None, ge=0, le=5)
    imagen: Optional[str] = Field(default=None, max_length=255)