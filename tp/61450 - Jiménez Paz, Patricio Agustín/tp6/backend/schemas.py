from pydantic import BaseModel


class UsuarioRegistro(BaseModel):
    nombre: str
    email: str
    password: str


class UsuarioLogin(BaseModel):
    email: str
    password: str


class ProductoCreateDTO(BaseModel):
    titulo: str
    precio: float
    categoria: str
    descripcion: str | None = None
    existencia: int | None = None
    valoracion: float | None = None
    imagen: str | None = None


class ProductoUpdateDTO(BaseModel):
    titulo: str | None = None
    precio: float | None = None
    categoria: str | None = None
    descripcion: str | None = None
    existencia: int | None = None
    valoracion: float | None = None
    imagen: str | None = None
