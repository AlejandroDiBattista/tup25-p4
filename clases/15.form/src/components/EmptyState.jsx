import React from 'react'
import { PersonIcon } from './icons.jsx'

export function EmptyState({ onCreate }) {
  return (
    <div className="empty-state">
      <PersonIcon size={48} />
      <h3>No hay contactos aún</h3>
      <p>Agrega tu primer contacto para comenzar a construir tu agenda.</p>
      <button type="button" className="primary-button" onClick={onCreate}>
        Crear contacto
      </button>
    </div>
  )
}

export default EmptyState
