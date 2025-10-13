import React from 'react'
import ContactRow from './ContactRow.jsx'

export function ContactList({
  contacts,
  selectedId,
  onSelect,
  onRequestEdit,
  onRequestDelete,
}) {
  const firstContactId = contacts[0]?.id
  const lastContactId = contacts[contacts.length - 1]?.id

  return (
    <div className="contact-list" role="listbox" aria-label="Contactos">
      {contacts.map((contact, index) => {
        const previousContact = index > 0 ? contacts[index - 1] : null
        const nextContact = index < contacts.length - 1 ? contacts[index + 1] : null

        return (
          <ContactRow
            key={contact.id}
            contact={contact}
            isSelected={contact.id === selectedId}
            onSelect={() => onSelect(contact.id)}
            onRequestEdit={() => onRequestEdit(contact.id)}
            onRequestDelete={() => onRequestDelete(contact.id)}
            onFocusPrevious={previousContact ? () => onSelect(previousContact.id) : undefined}
            onFocusNext={nextContact ? () => onSelect(nextContact.id) : undefined}
            onFocusFirst={firstContactId ? () => onSelect(firstContactId) : undefined}
            onFocusLast={lastContactId ? () => onSelect(lastContactId) : undefined}
          />
        )
      })}
    </div>
  )
}

export default ContactList
