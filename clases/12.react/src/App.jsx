import './App.css'

import Agenda from './Agenda.jsx'

function App() {

  const datos = [
    {id: 1, nombre: "Alejandro Di Battista", telefono: "123-456-7890", email: "alejandro@ejemplo.com"},
    {id: 2, nombre: "Juan Perez", telefono: "987-654-3210", email: "juan@ejemplo.com"}
  ]
  return (
      <Agenda contactos={datos} />
  )
}

export default App
