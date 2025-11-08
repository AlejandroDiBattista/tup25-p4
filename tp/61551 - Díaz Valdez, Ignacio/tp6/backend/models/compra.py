from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Compra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id", index=True)
    carrito_id: Optional[int] = Field(default=None, foreign_key="carrito.id")
    total_bruto: float = Field(default=0.0, ge=0)
    iva: float = Field(default=0.0, ge=0)
    envio: float = Field(default=0.0, ge=0)
    total_final: float = Field(default=0.0, ge=0)
    # Snapshot de la tarjeta usada (solo últimos 4 dígitos y marca)
    card_last4: Optional[str] = Field(default=None, max_length=4)
    card_brand: Optional[str] = Field(default=None, max_length=20)
    creado_en: datetime = Field(default_factory=datetime.utcnow)


class CompraItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    compra_id: int = Field(foreign_key="compra.id", index=True)
    producto_id: int = Field(foreign_key="producto.id")
    titulo_producto: str = Field(max_length=255)
    cantidad: int = Field(default=1, ge=1)
    precio_unitario: float = Field(default=0.0, ge=0)
    subtotal: float = Field(default=0.0, ge=0)