from sqlmodel import SQLModel, Field
from datetime import datetime

class Compra(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    usuario_email: str
    producto_id: int
    nombre_producto: str
    cantidad: int
    subtotal: float
    fecha: datetime = Field(default_factory=datetime.utcnow)
