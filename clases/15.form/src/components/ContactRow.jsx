import React, { useEffect, useMemo, useRef } from 'react'
import ContactAvatar from './ContactAvatar.jsx'

export function ContactRow({
  contact,
  isSelected,
  onSelect,
  onRequestEdit,
  onRequestDelete,
  onFocusPrevious,
  onFocusNext,
  onFocusFirst,
  onFocusLast,
}) {
  const cardRef = useRef(null)

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.focus()
    }
  }, [isSelected])

  const phoneList = useMemo(() => {
    if (!Array.isArray(contact.phones)) return []
    return contact.phones.filter(Boolean)
  }, [contact])

  const primaryPhone = phoneList[0] ?? contact.phone ?? 'Sin teléfono'
  const extraPhoneCount = Math.max(phoneList.length - 1, 0)

  const description = useMemo(() => {
    if (!Array.isArray(contact.emails)) return null
    const firstEmail = contact.emails.find((email) => Boolean(email))
    return firstEmail ?? null
  }, [contact])

  function handleCardClick() {
    onSelect?.()
  }

  function handleCardDoubleClick() {
    onRequestEdit?.()
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (!isSelected) {
        onSelect?.()
      }
      onRequestEdit?.()
    } else if (event.key === ' ') {
      event.preventDefault()
      onSelect?.()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      onFocusPrevious?.()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      onFocusNext?.()
    } else if (event.key === 'Home') {
      event.preventDefault()
      onFocusFirst?.()
    } else if (event.key === 'End') {
      event.preventDefault()
      onFocusLast?.()
    } else if (event.key === 'Delete') {
      event.preventDefault()
      onRequestDelete?.()
    }
  }

  return (
    <article
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      className={`contact-card${isSelected ? ' is-selected' : ''}`}
      onClick={handleCardClick}
      onDoubleClick={handleCardDoubleClick}
      onKeyDown={handleKeyDown}
      ref={cardRef}
    >
      <ContactAvatar firstName={contact.firstName} lastName={contact.lastName} />
      <div className="contact-card__body">
        <h3>{contact.firstName} {contact.lastName}</h3>
        <p className="contact-card__phone">
          {primaryPhone}
          {extraPhoneCount > 0 && <span className="contact-card__tag">+{extraPhoneCount}</span>}
        </p>
        {description && <p className="contact-card__description">{description}</p>}
      </div>
    </article>
  )
}

export default ContactRow
