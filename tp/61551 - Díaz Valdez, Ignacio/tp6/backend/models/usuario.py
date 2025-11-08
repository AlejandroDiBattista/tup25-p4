from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True, max_length=255)
    nombre: str = Field(default="", max_length=100)
    password_hash: str = Field(max_length=255)

    # Datos de método de pago preferido (nunca guardar PAN ni CVV)
    card_last4: Optional[str] = Field(default=None, max_length=4)
    card_brand: Optional[str] = Field(default=None, max_length=20)
    card_expiry_month: Optional[int] = Field(default=None, ge=1, le=12)
    card_expiry_year: Optional[int] = Field(default=None, ge=2020, le=2100)

    creado_en: datetime = Field(default_factory=datetime.utcnow)
    actualizado_en: datetime = Field(default_factory=datetime.utcnow)
