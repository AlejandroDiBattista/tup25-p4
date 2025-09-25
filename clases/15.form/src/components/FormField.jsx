import React from 'react'

export function FormField({ id, label, error, helper, children }) {
  const helperId = helper ? `${id}-helper` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <label className="form-field" htmlFor={id}>
      <span className="form-field__label">{label}</span>
      {children({
        id,
        'aria-describedby': [helperId, errorId].filter(Boolean).join(' ') || undefined,
        'aria-invalid': Boolean(error) || undefined,
      })}
      {helper ? (
        <span id={helperId} className="form-field__helper">
          {helper}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className="form-field__error" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}

export default FormField
