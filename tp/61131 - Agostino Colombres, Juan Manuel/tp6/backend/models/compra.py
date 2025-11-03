from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Compra(SQLModel, table=True):
  """Compra confirmada realizada por un usuario."""

  id: Optional[int] = Field(default=None, primary_key=True)
  usuario_id: int = Field(foreign_key="usuario.id", index=True)
  fecha: datetime = Field(default_factory=datetime.utcnow)
  direccion: str = Field(default="", max_length=255)
  tarjeta: str = Field(default="", max_length=32)
  total: float = Field(default=0.0, ge=0)
  envio: str = Field(default="", max_length=50)

  # Items relacionados por CompraItem (ver modelo CompraItem).


class CompraItem(SQLModel, table=True):
  """Detalle de un producto incluido en la compra."""

  id: Optional[int] = Field(default=None, primary_key=True)
  compra_id: int = Field(foreign_key="compra.id", index=True)
  producto_id: int = Field(foreign_key="producto.id")
  nombre: str = Field(default="", max_length=255)
  precio_unitario: float = Field(default=0.0, ge=0)
  cantidad: int = Field(default=1, ge=1)

  # Relación inversa manejada a nivel de consultas cuando sea necesario.