import React, { useEffect, useMemo, useRef, useState } from 'react'
import ContactDetail from './components/ContactDetail.jsx'
import ContactForm from './components/ContactForm.jsx'
import ContactList from './components/ContactList.jsx'
import EmptyState from './components/EmptyState.jsx'
import IconButton from './components/IconButton.jsx'
import { PersonIcon, PlusIcon } from './components/icons.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'

import './App.css'

const STORAGE_KEY = 'tup-25:contact-list'

const SAMPLE_CONTACTS = [
  {
    id: 'sample-ada',
    firstName: 'Ada',
    lastName: 'Lovelace',
    phones: ['+44 20 7946 0958'],
    emails: ['ada@analytical.engine'],
  },
  {
    id: 'sample-grace',
    firstName: 'Grace',
    lastName: 'Hopper',
    phones: ['+1 212 555 0199'],
    emails: ['grace@navy.mil'],
  },
]

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `contact-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function ensureContactShape(contact) {
  if (!contact) return contact

  const hasPhonesArray = Array.isArray(contact.phones)
  const hasEmailsArray = Array.isArray(contact.emails)

  const phones = hasPhonesArray
    ? contact.phones
    : contact.phone
      ? [contact.phone]
      : []

  const emails = hasEmailsArray
    ? contact.emails
    : contact.email
      ? [contact.email]
      : []

  if (hasPhonesArray && hasEmailsArray && !('phone' in contact) && !('email' in contact)) {
    return contact
  }

  const { phone, email, ...rest } = contact
  return {
    ...rest,
    phones,
    emails,
  }
}

function createContact(values) {
  return {
    id: generateId(),
    ...values,
  }
}

function normaliseText(value) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export default function App() {
  const [contacts, setContacts] = useLocalStorage(STORAGE_KEY, () => SAMPLE_CONTACTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [panelMode, setPanelMode] = useState('view') // view | edit | create
  const [selectedId, setSelectedId] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const searchInputRef = useRef(null)
  const previousSelectedIdRef = useRef(null)

  useEffect(() => {
    setContacts((prev) => {
      let mutated = false
      const next = prev.map((contact) => {
        const ensured = ensureContactShape(contact)
        if (ensured !== contact) {
          mutated = true
        }
        return ensured
      })
      return mutated ? next : prev
    })
  }, [setContacts])

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  const filteredContacts = useMemo(() => {
    const query = searchTerm.trim()
    if (!query) return contacts

    const normalisedQuery = normaliseText(query)

    return contacts.filter((contact) => {
      const sources = [contact.firstName, contact.lastName]

      if (Array.isArray(contact.phones)) {
        sources.push(...contact.phones)
      }

      if (Array.isArray(contact.emails)) {
        sources.push(...contact.emails)
      }

      return sources.some((source) => {
        if (!source) return false
        return normaliseText(String(source)).includes(normalisedQuery)
      })
    })
  }, [contacts, searchTerm])

  const selectedContact = useMemo(
    () => contacts.find((contact) => contact.id === selectedId) ?? null,
    [contacts, selectedId],
  )

  const hasContacts = contacts.length > 0
  const hasFilteredContacts = filteredContacts.length > 0
  const isCreateMode = panelMode === 'create'
  const isEditMode = panelMode === 'edit' && selectedContact

  useEffect(() => {
    if (isCreateMode) return

    if (!hasContacts) {
      if (selectedId !== null) setSelectedId(null)
      return
    }

    const exists = contacts.some((contact) => contact.id === selectedId)
    if (!exists) {
      setSelectedId(contacts[0].id)
    }
  }, [contacts, hasContacts, isCreateMode, selectedId])

  useEffect(() => {
    if (isCreateMode) return

    if (!hasFilteredContacts) {
      if (selectedId !== null) setSelectedId(null)
      return
    }

    const visible = filteredContacts.some((contact) => contact.id === selectedId)
    if (!visible) {
      setSelectedId(filteredContacts[0].id)
    }
  }, [filteredContacts, hasFilteredContacts, isCreateMode, selectedId])

  function handleSearchChange(event) {
    setSearchTerm(event.target.value)
  }

  function handleSelect(contactId) {
    if (panelMode === 'create') {
      setPanelMode('view')
    }
    setPendingDeleteId(null)
    setSelectedId(contactId)
  }

  function handleCreateRequest() {
    previousSelectedIdRef.current = selectedId
    setSelectedId(null)
    setPanelMode('create')
  }

  function handleSubmit(values) {
    if (panelMode === 'edit' && selectedContact) {
      const updatedContact = {
        ...selectedContact,
        ...values,
      }

      setContacts((prev) =>
        prev.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact)),
      )
      setPanelMode('view')
      setSelectedId(updatedContact.id)
      setPendingDeleteId(null)
      return
    }

    const newContact = createContact(values)
    setContacts((prev) => [...prev, newContact])
    setPanelMode('view')
    setSelectedId(newContact.id)
    previousSelectedIdRef.current = null
    setPendingDeleteId(null)
  }

  function handleCancelForm() {
    if (panelMode === 'create') {
      setPanelMode('view')
      if (hasContacts) {
        const fallbackId = previousSelectedIdRef.current
        if (fallbackId && contacts.some((contact) => contact.id === fallbackId)) {
          setSelectedId(fallbackId)
        } else if (contacts[0]) {
          setSelectedId(contacts[0].id)
        }
      }
      previousSelectedIdRef.current = null
      setPendingDeleteId(null)
      return
    }

    if (panelMode === 'edit') {
      setPanelMode('view')
      setPendingDeleteId(null)
    }
  }

  function handleEdit(contactId) {
    setSelectedId(contactId)
    setPanelMode('edit')
    setPendingDeleteId(null)
  }

  function performDelete(contactId) {
    const deletingSelected = contactId === selectedId
    let nextSelectedId = selectedId
    let nextPanelMode = deletingSelected ? 'view' : panelMode

    setContacts((prev) => {
      const index = prev.findIndex((contact) => contact.id === contactId)
      if (index === -1) {
        nextPanelMode = prev.length === 0 ? 'create' : panelMode
        return prev
      }

      const next = [...prev.slice(0, index), ...prev.slice(index + 1)]

      if (next.length === 0) {
        nextSelectedId = null
        nextPanelMode = 'create'
      } else {
        if (deletingSelected) {
          const fallbackIndex = index >= next.length ? next.length - 1 : index
          nextSelectedId = next[fallbackIndex].id
          nextPanelMode = 'view'
        } else if (!next.some((contact) => contact.id === selectedId)) {
          const fallbackIndex = Math.min(index, next.length - 1)
          nextSelectedId = next[fallbackIndex].id
        }
      }

      return next
    })

    setPanelMode(nextPanelMode)
    setSelectedId(nextSelectedId)
    previousSelectedIdRef.current = nextSelectedId
  }

  function handleRequestDelete(contactId) {
    if (panelMode === 'create') {
      setPanelMode('view')
    }
    if (selectedId !== contactId) {
      setSelectedId(contactId)
    }
    setPendingDeleteId(contactId)
  }

  function handleCancelDelete() {
    setPendingDeleteId(null)
  }

  function handleConfirmDelete(contactId) {
    setPendingDeleteId(null)
    performDelete(contactId)
  }

  useEffect(() => {
    setPendingDeleteId(null)
  }, [selectedId, panelMode])

  function handleClearSearch() {
    setSearchTerm('')
  }

  function handleSearchKeyDown(event) {
    const hasResults = filteredContacts.length > 0

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (hasResults) {
        handleSelect(filteredContacts[0].id)
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (hasResults) {
        handleSelect(filteredContacts[filteredContacts.length - 1].id)
      }
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (hasResults) {
        handleSelect(filteredContacts[0].id)
      }
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__titles">
          <span className="app-icon">
            <PersonIcon size={32} />
          </span>
          <div>
            <h1>Agenda de contactos</h1>
            <p>Gestiona y edita tus contactos con un flujo sencillo y moderno.</p>
          </div>
        </div>
        <IconButton
          label="Crear contacto"
          icon={<PlusIcon size={22} />}
          variant="primary"
          onClick={handleCreateRequest}
        />
      </header>

      <main className="app-main">
        <section className="panel list-panel">
          <div className="list-panel__header">
            <h2>Contactos</h2>
            <span className="badge">{filteredContacts.length}</span>
          </div>
          <div className="search-box">
            <input
              type="search"
              className="search-input"
              placeholder="Buscar por nombre, teléfono o email"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              ref={searchInputRef}
            />
            {searchTerm && (
              <button type="button" className="clear-search" onClick={handleClearSearch}>
                Limpiar
              </button>
            )}
          </div>

          {hasFilteredContacts ? (
            <ContactList
              contacts={filteredContacts}
              selectedId={selectedId}
              onSelect={handleSelect}
              onRequestEdit={handleEdit}
              onRequestDelete={handleRequestDelete}
            />
          ) : (
            <div className="list-empty">
              <p className="list-empty__title">No se encontraron contactos</p>
              <p className="list-empty__body">
                Revisa el término de búsqueda o crea un contacto nuevo.
              </p>
              <button type="button" className="ghost-button" onClick={handleCreateRequest}>
                Nuevo contacto
              </button>
            </div>
          )}
        </section>

        <section className="panel detail-panel" aria-live="polite">
          {isCreateMode ? (
            <ContactForm
              key="create"
              mode="create"
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
            />
          ) : isEditMode && selectedContact ? (
            <ContactForm
              key={selectedContact.id}
              mode="edit"
              initialValues={selectedContact}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
            />
          ) : selectedContact && hasFilteredContacts ? (
            <ContactDetail
              contact={selectedContact}
              onEdit={() => handleEdit(selectedContact.id)}
              onRequestDelete={() => handleRequestDelete(selectedContact.id)}
              onCancelDelete={handleCancelDelete}
              onConfirmDelete={() => handleConfirmDelete(selectedContact.id)}
              isConfirmingDelete={pendingDeleteId === selectedContact.id}
            />
          ) : hasContacts ? (
            <div className="detail-empty">
              <h2>Sin coincidencias</h2>
              <p>Modifica tu búsqueda o crea un nuevo contacto.</p>
              <button type="button" className="primary-button" onClick={handleCreateRequest}>
                Agregar contacto
              </button>
            </div>
          ) : (
            <EmptyState onCreate={handleCreateRequest} />
          )}
        </section>
      </main>
    </div>
  )
}
