from pydantic import BaseModel


class UsuarioRegistro(BaseModel):
    nombre: str
    email: str
    password: str


class UsuarioLogin(BaseModel):
    email: str
    password: str
