import React, { useState } from 'react'

import './App.css'
import FormEdicion from './4.form'

const inicial = { nombre: 'Ada', apellido: 'Lovelace', telefono: '555-1234' }

function App() {
  const [editando, setEditando] = useState(false)
  const [persona, setPersona]   = useState(inicial)

  const manejarAceptar = (values) => {
    setPersona(values)
    setEditando(false)
  }

  const manejarCancelar = () => {
    setEditando(false)
  }

  return (
    <div>
      {editando ? (
        <FormEdicion
          datos={persona}
          leyenda="Editar persona"
          onAceptar={manejarAceptar}
          onCancelar={manejarCancelar}
        />
      ) : (
        <button onClick={() => setEditando(true)}>Editar</button>
      )}
      <pre>{JSON.stringify(persona, null, 2)}</pre>
    </div>
  )
}

export default App
