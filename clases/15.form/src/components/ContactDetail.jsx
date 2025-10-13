import React, { useMemo } from 'react'
import ContactAvatar from './ContactAvatar.jsx'
import { EraserIcon } from './icons.jsx'

export function ContactDetail({
  contact,
  onEdit,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  isConfirmingDelete,
}) {
  const fullName = useMemo(
    () => `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim(),
    [contact.firstName, contact.lastName],
  )

  const phones = Array.isArray(contact.phones) ? contact.phones.filter(Boolean) : []
  const emails = Array.isArray(contact.emails) ? contact.emails.filter(Boolean) : []

  function handleEdit() {
    onEdit?.()
  }

  function handleRequestDelete() {
    onRequestDelete?.()
  }

  function handleCancelDelete() {
    onCancelDelete?.()
  }

  function handleConfirmDelete() {
    onConfirmDelete?.()
  }

  return (
    <article className="contact-detail">
      <header className="contact-detail__header">
        <div className="contact-detail__identity">
          <ContactAvatar firstName={contact.firstName} lastName={contact.lastName} />
          <div>
            <h2>{fullName}</h2>
            {emails.length > 0 && <p>{emails[0]}</p>}
          </div>
        </div>
      </header>

      <div className="contact-detail__content">
        <section>
          <h3>Teléfonos</h3>
          {phones.length > 0 ? (
            <ul className="contact-detail__list">
              {phones.map((phone, index) => {
                const telValue = phone.replace(/[^0-9+]/g, '')
                return (
                  <li key={`${phone}-${index}`}>
                    <a href={`tel:${telValue}`}>{phone}</a>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="contact-detail__empty">Sin teléfonos registrados</p>
          )}
        </section>

        <section>
          <h3>Emails</h3>
          {emails.length > 0 ? (
            <ul className="contact-detail__list">
              {emails.map((email, index) => (
                <li key={`${email}-${index}`}>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="contact-detail__empty">Sin emails registrados</p>
          )}
        </section>
      </div>

      <footer className="contact-detail__footer">
        {isConfirmingDelete ? (
          <div className="contact-detail__confirm">
            <p>¿Eliminar este contacto?</p>
            <div className="contact-detail__actions">
              <button type="button" className="ghost-button" onClick={handleCancelDelete}>
                Cancelar
              </button>
              <button type="button" className="danger-button" onClick={handleConfirmDelete}>
                Confirmar
              </button>
            </div>
          </div>
        ) : (
          <div className="contact-detail__actions">
            <button type="button" className="primary-button" onClick={handleEdit}>
              Editar
            </button>
            <button type="button" className="danger-button" onClick={handleRequestDelete}>
              <EraserIcon size={18} />
              Borrar
            </button>
          </div>
        )}
      </footer>
    </article>
  )
}

export default ContactDetail
