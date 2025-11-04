from sqlmodel import SQLModel, Field

class CompraFinalizar(SQLModel):
    """Datos necesarios para finalizar la compra (checkout)."""
    direccion: str = Field(max_length=255)
    tarjeta: str = Field(max_length=20) # Simulación, no para producción
    # No pedimos el total, lo calcularemos en el servidor

class CompraExito(SQLModel):
    """Respuesta al finalizar la compra."""
    message: str
    compra_id: int
    total_pagado: float