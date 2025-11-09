from sqlmodel import SQLModel
from datetime import datetime
from typing import List

# --- Esquemas para Items de Compra ---
# (Se usa para la respuesta)
class ItemCompraResponse(SQLModel):
    producto_id: int
    cantidad: int
    nombre: str
    precio_unitario: float

# --- Esquemas para Compra ---

# Input: Lo que el usuario envía al finalizar
class CompraCreate(SQLModel):
    direccion: str
    tarjeta: str # Simplificado según el enunciado

# Output: Lo que la API devuelve al finalizar
class CompraResponse(SQLModel):
    id: int
    usuario_id: int
    fecha: datetime
    direccion: str
    total: float
    envio: float
    items: List[ItemCompraResponse]