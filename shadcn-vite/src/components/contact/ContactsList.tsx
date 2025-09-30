import { ContactCard } from "./ContactCard"
import type { Contact } from "./types"

interface ContactsListProps {
  contacts: Contact[]
  onEditContact: (contact: Contact) => void
  onDeleteContact?: (contact: Contact) => void
}

export function ContactsList({ contacts, onEditContact, onDeleteContact }: ContactsListProps) {
  return (
    <div className="w-full max-w-4xl space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Lista de Contactos
        </h2>
        <p className="text-gray-600">
          {contacts.length} contactos disponibles
        </p>
      </div>
      
      {/* Grid responsivo de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <ContactCard 
            key={contact.id} 
            contact={contact} 
            onEdit={onEditContact}
            onDelete={onDeleteContact}
          />
        ))}
      </div>
    </div>
  )
}