from pydantic import BaseModel, Field

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