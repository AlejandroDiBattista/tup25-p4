from pydantic import BaseModel


class ProductoRead(BaseModel):
    id: int
    nombre: str
    descripcion: str
    precio: float
    categoria: str
    existencia: int

    class Config:
        from_attributes = True
