import React, { useEffect, useMemo, useState } from 'react'
import FormField from './FormField.jsx'
import IconButton from './IconButton.jsx'
import { CloseIcon, PlusIcon } from './icons.jsx'

const emptyValues = {
  firstName: '',
  lastName: '',
  phones: [''],
  emails: [],
}

function normaliseInitialValues(values = emptyValues) {
  const firstName = values.firstName ?? ''
  const lastName = values.lastName ?? ''

  const phoneCandidates = Array.isArray(values.phones)
    ? values.phones
    : values.phone
      ? [values.phone]
      : []

  const emailCandidates = Array.isArray(values.emails)
    ? values.emails
    : values.email
      ? [values.email]
      : []

  const phones = (phoneCandidates.length > 0 ? phoneCandidates : ['']).map((phone) =>
    String(phone ?? ''),
  )
  const emails = emailCandidates.map((email) => String(email ?? ''))

  return {
    firstName,
    lastName,
    phones,
    emails,
  }
}

function createTouchedState(values) {
  return {
    firstName: false,
    lastName: false,
    phones: values.phones.map(() => false),
    emails: values.emails.map(() => false),
  }
}

function markAllTouched(values) {
  return {
    firstName: true,
    lastName: true,
    phones: values.phones.map(() => true),
    emails: values.emails.map(() => true),
  }
}

function validate(values) {
  const errors = {
    firstName: '',
    lastName: '',
    phones: values.phones.map(() => ''),
    emails: values.emails.map(() => ''),
  }

  if (!values.firstName.trim()) {
    errors.firstName = 'El nombre es obligatorio'
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'El apellido es obligatorio'
  }

  const trimmedPhones = values.phones.map((phone) => phone.trim())
  const hasAtLeastOnePhone = trimmedPhones.some((phone) => phone.length > 0)

  if (!hasAtLeastOnePhone) {
    if (errors.phones.length === 0) {
      errors.phones = ['Agrega al menos un teléfono']
    } else {
      errors.phones[0] = 'Agrega al menos un teléfono'
    }
  }

  trimmedPhones.forEach((phone, index) => {
    if (!phone) return
    const digits = phone.replace(/[^0-9]/g, '')
    if (digits.length < 6) {
      errors.phones[index] = 'Debe tener al menos 6 dígitos'
    }
  })

  values.emails.forEach((email, index) => {
    const trimmed = email.trim()
    if (!trimmed) return
    const emailPattern = /^(?:[^\s@]+)@(?:[^\s@]+)\.[^\s@]+$/
    if (!emailPattern.test(trimmed)) {
      errors.emails[index] = 'Email inválido'
    }
  })

  return errors
}

function hasFormErrors(errors) {
  return (
    Boolean(errors.firstName) ||
    Boolean(errors.lastName) ||
    errors.phones.some(Boolean) ||
    errors.emails.some(Boolean)
  )
}

export function ContactForm({ mode = 'create', initialValues = emptyValues, onSubmit, onCancel }) {
  const normalisedInitial = useMemo(() => normaliseInitialValues(initialValues), [initialValues])

  const [values, setValues] = useState(normalisedInitial)
  const [touched, setTouched] = useState(() => createTouchedState(normalisedInitial))

  useEffect(() => {
    setValues(normalisedInitial)
    setTouched(createTouchedState(normalisedInitial))
  }, [normalisedInitial])

  const errors = useMemo(() => validate(values), [values])

  const title = mode === 'edit' ? 'Editar contacto' : 'Nuevo contacto'

  function handleFieldChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleFieldBlur(event) {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  function handlePhoneChange(index, value) {
    setValues((prev) => {
      const nextPhones = [...prev.phones]
      nextPhones[index] = value
      return { ...prev, phones: nextPhones }
    })
  }

  function handlePhoneBlur(index) {
    setTouched((prev) => {
      const nextPhones = [...prev.phones]
      nextPhones[index] = true
      return { ...prev, phones: nextPhones }
    })
  }

  function handleAddPhone() {
    setValues((prev) => ({ ...prev, phones: [...prev.phones, ''] }))
    setTouched((prev) => ({ ...prev, phones: [...prev.phones, false] }))
  }

  function handleRemovePhone(index) {
    setValues((prev) => {
      if (prev.phones.length <= 1) return prev
      const nextPhones = prev.phones.filter((_, itemIndex) => itemIndex !== index)
      return { ...prev, phones: nextPhones }
    })
    setTouched((prev) => {
      if (prev.phones.length <= 1) return prev
      const nextPhones = prev.phones.filter((_, itemIndex) => itemIndex !== index)
      return { ...prev, phones: nextPhones }
    })
  }

  function handleEmailChange(index, value) {
    setValues((prev) => {
      const nextEmails = [...prev.emails]
      nextEmails[index] = value
      return { ...prev, emails: nextEmails }
    })
  }

  function handleEmailBlur(index) {
    setTouched((prev) => {
      const nextEmails = [...prev.emails]
      nextEmails[index] = true
      return { ...prev, emails: nextEmails }
    })
  }

  function handleAddEmail() {
    setValues((prev) => ({ ...prev, emails: [...prev.emails, ''] }))
    setTouched((prev) => ({ ...prev, emails: [...prev.emails, false] }))
  }

  function handleRemoveEmail(index) {
    setValues((prev) => {
      const nextEmails = prev.emails.filter((_, itemIndex) => itemIndex !== index)
      return { ...prev, emails: nextEmails }
    })
    setTouched((prev) => {
      const nextEmails = prev.emails.filter((_, itemIndex) => itemIndex !== index)
      return { ...prev, emails: nextEmails }
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const validation = validate(values)
    if (hasFormErrors(validation)) {
      setTouched(markAllTouched(values))
      return
    }

    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phones: values.phones.map((phone) => phone.trim()).filter(Boolean),
      emails: values.emails.map((email) => email.trim()).filter(Boolean),
    }

    onSubmit?.(payload)

    if (mode === 'create') {
      const resetValues = normaliseInitialValues(emptyValues)
      setValues(resetValues)
      setTouched(createTouchedState(resetValues))
    }
  }

  function handleCancel(event) {
    event.preventDefault()

    if (mode === 'create') {
      const resetValues = normaliseInitialValues(emptyValues)
      setValues(resetValues)
      setTouched(createTouchedState(resetValues))
    } else {
      setValues(normalisedInitial)
      setTouched(createTouchedState(normalisedInitial))
    }

    onCancel?.()
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <h2>{title}</h2>
        {mode === 'edit' && (
          <button type="button" className="link-button" onClick={handleCancel}>
            Cancelar edición
          </button>
        )}
      </div>

      <div className="form-grid">
        <FormField id="firstName" label="Nombre" error={touched.firstName ? errors.firstName : ''}>
          {(inputProps) => (
            <input
              {...inputProps}
              type="text"
              name="firstName"
              placeholder="Ej. Ada"
              value={values.firstName}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              maxLength={60}
              required
            />
          )}
        </FormField>

        <FormField id="lastName" label="Apellido" error={touched.lastName ? errors.lastName : ''}>
          {(inputProps) => (
            <input
              {...inputProps}
              type="text"
              name="lastName"
              placeholder="Ej. Lovelace"
              value={values.lastName}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              maxLength={60}
              required
            />
          )}
        </FormField>
      </div>

      <fieldset className="field-array">
        <legend>Teléfonos</legend>
        <p className="field-array__helper">Al menos uno es obligatorio.</p>
        <div className="field-array__items">
          {values.phones.map((phone, index) => (
            <div className="field-array__row" key={`phone-${index}`}>
              <FormField
                id={`phone-${index}`}
                label={`Teléfono ${index + 1}`}
                error={touched.phones[index] ? errors.phones[index] : ''}
              >
                {(inputProps) => (
                  <input
                    {...inputProps}
                    type="tel"
                    placeholder="Ej. +54 11 5555 1234"
                    value={phone}
                    onChange={(event) => handlePhoneChange(index, event.target.value)}
                    onBlur={() => handlePhoneBlur(index)}
                    maxLength={30}
                    required={index === 0}
                  />
                )}
              </FormField>
              <IconButton
                label="Eliminar teléfono"
                icon={<CloseIcon size={18} />}
                variant="ghost danger"
                onClick={(event) => {
                  event.preventDefault()
                  handleRemovePhone(index)
                }}
                disabled={values.phones.length <= 1}
              />
            </div>
          ))}
        </div>
        <button type="button" className="ghost-button" onClick={handleAddPhone}>
          <PlusIcon size={16} />
          Agregar teléfono
        </button>
      </fieldset>

      <fieldset className="field-array">
        <legend>Emails</legend>
        <p className="field-array__helper">Opcional. Usa uno por linea.</p>
        {values.emails.length > 0 ? (
          <div className="field-array__items">
            {values.emails.map((email, index) => (
              <div className="field-array__row" key={`email-${index}`}>
                <FormField
                  id={`email-${index}`}
                  label={`Email ${index + 1}`}
                  error={touched.emails[index] ? errors.emails[index] : ''}
                >
                  {(inputProps) => (
                    <input
                      {...inputProps}
                      type="email"
                      placeholder="Ej. ada@ejemplo.com"
                      value={email}
                      onChange={(event) => handleEmailChange(index, event.target.value)}
                      onBlur={() => handleEmailBlur(index)}
                      maxLength={100}
                    />
                  )}
                </FormField>
                <IconButton
                  label="Eliminar email"
                  icon={<CloseIcon size={18} />}
                  variant="ghost danger"
                  onClick={(event) => {
                    event.preventDefault()
                    handleRemoveEmail(index)
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="field-array__empty">No agregaste emails.</p>
        )}
        <button type="button" className="ghost-button" onClick={handleAddEmail}>
          <PlusIcon size={16} />
          Agregar email
        </button>
      </fieldset>

      <div className="form-actions">
        <button type="submit" className="primary-button">
          {mode === 'edit' ? 'Guardar cambios' : 'Agregar contacto'}
        </button>
        <button type="button" className="ghost-button" onClick={handleCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default ContactForm
