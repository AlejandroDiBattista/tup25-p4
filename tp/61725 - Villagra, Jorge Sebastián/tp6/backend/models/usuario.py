from typing import Optional
from sqlmodel import SQLModel, Field

class Usuario(SQLModel, table=True):
    __tablename__ = "usuario"
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    email: str = Field(index=True, unique=True)
    password_hash: str
