from sqlmodel import Field, SQLModel, Relationship


class Phone(SQLModel, table=True):
    """Modelo para almacenar teléfonos de contactos"""
    id: int | None = Field(default=None, primary_key=True)
    number: str = Field(index=True)
    contact_id: int | None = Field(default=None, foreign_key="contact.id")
    contact: "Contact | None" = Relationship(back_populates="phones")


class Contact(SQLModel, table=True):
    """Modelo para almacenar contactos"""
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    apellido: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    phones: list[Phone] = Relationship(
        back_populates="contact",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
