from pydantic import BaseModel, Field
from typing import Optional

# Patrón de Regex para validar emails
EMAIL_REGEX = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

# Esquema de Usuario

class UsuarioBase(BaseModel):
    """Modelo base que comparte campos comunes."""
    nombre: str
    email: str = Field(
        pattern=EMAIL_REGEX,
        example="usuario@mail.com"
    )

class UsuarioRegistro(UsuarioBase):
    """El modelo que espera recibir del frontend al registrar un usuario."""
    contrasenia: str

class UsuarioRespuesta(UsuarioBase):
    """El modelo que se envía como respuesta cuando se registra o se pide un usuario."""
    id: int

    # Configuración para decirle a Pydantic que puede leer datos desde un objeto de SQLModel
    class Config:
        from_attributes = True

class ProductoBase(BaseModel):
    """Modelo base que comparte campos comunes."""
    titulo: str
    descripcion: str
    precio: float
    categoria: str
    existencia: int
    imagen: str
    valoracion: float

class ProductoRespuesta(ProductoBase):
    """El modelo que se envía como respuesta cuando se pide un producto."""
    id: int

    class Config:
        from_attributes = True

class UsuarioLogin(BaseModel):
    """El modelo que espera recibir del frontend al iniciar sesión."""
    email: str = Field(
        pattern=EMAIL_REGEX,
        example="usuario@mail.com"
    )
    contrasenia: str

class Token(BaseModel):
    """Modelo para el token JWT."""
    access_token: str
    token_type: str = "bearer"

class CarritoItemRespuesta(BaseModel):
    """Modelo para representar un ítem en el carrito."""
    id: int
    cantidad: int
    producto_id: int

    # Se incluyen los detalles del producto
    producto: ProductoRespuesta

    class Config:
        from_attributes = True

class CarritoRespuesta(BaseModel):
    """Modelo para representar el carrito de un usuario."""
    id: int
    usuario_id: int

    # Se incluyen los ítems del carrito
    items: list[CarritoItemRespuesta] = []

    class Config:
        from_attributes = True

class CarritoAgregarProducto(BaseModel):
    """Modelo para agregar un producto al carrito."""
    producto_id: int
    cantidad: int = Field(default=1, ge=1)

class CarritoEliminarItem(BaseModel):
    """Modelo para eliminar un producto del carrito."""
    carrito_item_id: int