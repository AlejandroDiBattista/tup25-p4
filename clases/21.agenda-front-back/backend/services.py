from sqlmodel import Session, select
from models  import Contact, Phone
from schemas import ContactCreate, ContactUpdate


class ContactService:
    """Servicio para gestionar contactos"""
    
    @staticmethod
    def get_contacts(session: Session, search: str | None = None) -> list[Contact]:
        """Obtener lista de contactos con búsqueda opcional"""
        query = select(Contact).order_by(Contact.apellido, Contact.nombre)

        if search_term := (search or "").strip():
            like_value = f"%{search_term}%"
            query = query.where(
                Contact.nombre.ilike(like_value) |
                Contact.apellido.ilike(like_value) |
                Contact.email.ilike(like_value)
            )

        return list(session.exec(query))
    
    
    @staticmethod
    def get_contact(session: Session, contact_id: int) -> Contact | None:
        """Obtener un contacto por ID"""
        return session.get(Contact, contact_id)
    
    
    @staticmethod
    def create_contact(session: Session, contact_data: ContactCreate) -> Contact:
        """Crear un nuevo contacto con teléfonos"""
        # Crear el contacto
        contact = Contact( nombre=contact_data.nombre, apellido=contact_data.apellido, email=contact_data.email )
        session.add(contact)
        session.flush()
        
        # Agregar teléfonos no vacíos
        for phone_number in contact_data.phones:
            if phone_number.strip():  # Ignorar teléfonos en blanco
                phone = Phone(number=phone_number.strip(), contact_id=contact.id)
                session.add(phone)
        
        session.commit()
        session.refresh(contact)
        return contact
    
    
    @staticmethod
    def update_contact( session: Session, contact_id: int, contact_data: ContactUpdate ) -> Contact | None:
        """Actualizar un contacto existente"""
        contact = session.get(Contact, contact_id)
        if not contact:
            return None
        
        # Actualizar datos básicos
        contact.nombre   = contact_data.nombre
        contact.apellido = contact_data.apellido
        contact.email    = contact_data.email

        # Eliminar teléfonos existentes
        for phone in contact.phones:
            session.delete(phone)
        
        # Agregar nuevos teléfonos no vacíos
        for phone_number in contact_data.phones:
            if phone_number.strip():  # Ignorar teléfonos en blanco
                phone = Phone(number=phone_number.strip(), contact_id=contact.id)
                session.add(phone)
        
        session.commit()
        session.refresh(contact)
        return contact
    
    @staticmethod
    def delete_contact(session: Session, contact_id: int) -> bool:
        """Eliminar un contacto"""
        contact = session.get(Contact, contact_id)
        if not contact:
            return False
        
        session.delete(contact)
        session.commit()
        return True
