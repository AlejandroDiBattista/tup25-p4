from pydantic import BaseModel, EmailStr

# Esquema de Usuario

class UsuarioBase(BaseModel):
    """Modelo base que comparte campos comunes."""
    nombre: str
    email: EmailStr

class UsuarioRegistro(UsuarioBase):
    """El modelo que espera recibir del frontend al registrar un usuario."""
    contrasenia: str

class UsuarioRespuesta(UsuarioBase):
    """El modelo que se envía como respuesta cuando se registra o se pide un usuario."""
    id: int

    # Configuración para decirle a Pydantic que puede leer datos desde un objeto de SQLModel
    class Config:
        from_attributes = True