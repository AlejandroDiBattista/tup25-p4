from sqlmodel import Field, SQLModel

class Usuario(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    contrasenia: str # Se almacenará el hash, no la contraseña en texto plano