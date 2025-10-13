import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, NavLink, useParams, Navigate, Outlet } from 'react-router'

// Contexto simple para simular una "base de datos"
const ContactsContext = createContext(null)
const useContacts = () => useContext(ContactsContext)

function App() {
  const [contacts, setContacts] = useState([
    { id: '123', nombre: 'Ada Lovelace', email: 'ada@example.com',   telefono: '+44 20 1234 5678' },
    { id: '456', nombre: 'Alan Turing',  email: 'alan@example.com',  telefono: '+44 20 8765 4321' },
    { id: '789', nombre: 'Grace Hopper', email: 'grace@example.com', telefono: '+44 20 5555 5555' }
  ])

  const updateContact = (id, data) => {
    setContacts(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)))
  }

  const ctxValue = { contacts, updateContact }

  return (
    <Router>
      <ContactsContext.Provider value={ctxValue}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="contacto">
              <Route index element={<Contacto />} />
              <Route path=":id" element={<Contacto />} />
              <Route path=":id/editar" element={<EditarContacto />} />
            </Route>
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </ContactsContext.Provider>
    </Router>
  )
}

function Layout() {
  return (
    <>
      <Navbar />
      <main className="page-container">
        <Outlet />
      </main>
      <footer className="page-footer">
        <p>© 2023 Mi Aplicación de Contactos</p>
      </footer>
    </>
  )
}

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end className="nav-link">
        Home
      </NavLink>
      <div className="navbar-spacer" />
      <NavLink to="/contacto/123" className="nav-link">
        Contacto 123
      </NavLink>
      <NavLink to="/contacto/456" className="nav-link">
        Contacto 456
      </NavLink>
      <NavLink to="/about" className="nav-link">
        About
      </NavLink>
    </nav>
  )
}

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Bienvenido a la aplicación de gestión de contactos.</p>
      <p>Usa el menú de navegación para ver los contactos o la página de información.</p>
    </div>
  )
}

function About() {
  return (<>
    <h1>About</h1>
    <p>Esta es la página de información sobre la aplicación.</p>
    <NavLink className="btn btn--sm" to="/">Volver al inicio</NavLink>
  </>)
}

function Contacto() {
  const { id } = useParams()
  const { contacts } = useContacts()
  const contacto = contacts.find(c => c.id === id)

  if (!contacto) {
    return (
      <div>
        <h1>Contacto no encontrado</h1>
        <p>El contacto con id "{id}" no existe.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>{contacto.nombre}</h1>
      <hr/>
      <table>
        <tbody>
          <tr><td><strong>ID:</strong></td><td>{contacto.id}</td></tr>
          <tr><td><strong>Email:</strong></td><td>{contacto.email}</td></tr>
          <tr><td><strong>Teléfono:</strong></td><td>{contacto.telefono}</td></tr>
        </tbody>
      </table>
      <hr/>
      <NavLink className="btn btn--sm" to={`/contacto/${id}/editar`}>Editar</NavLink>
    </div>
  )
}

function EditarContacto() {
  const { id } = useParams()
  const { contacts, updateContact } = useContacts()
  const contacto = contacts.find(c => c.id === id)

  const [form, setForm] = useState(() => ({
    nombre: contacto?.nombre ?? '',
    email: contacto?.email ?? '',
    telefono: contacto?.telefono ?? '',
  }))

  if (!contacto) {
    return (
      <div>
        <h1>Contacto no encontrado</h1>
        <p>No se puede editar porque el contacto no existe.</p>
      </div>
    )
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const [redirect, setRedirect] = useState(false)
  const onSubmit = (e) => {
    e.preventDefault()
    updateContact(id, form)
    setRedirect(true)
  }

  if (redirect) {
    return <Navigate to={`/contacto/${id}`} replace />
  }

  return (
    <form onSubmit={onSubmit}>
      <legend>Editar contacto</legend>

      <label>
        Nombre
        <input name="nombre" value={form.nombre} onChange={onChange} required />
      </label>

      <label>
        Email
        <input type="email" name="email" value={form.email} onChange={onChange} required />
      </label>

      <label>
        Teléfono
        <input name="telefono" value={form.telefono} onChange={onChange} />
      </label>

      <fieldset>
        <NavLink className="btn btn--sm" to={`/contacto/${id}`}>Cancelar</NavLink>
        <button type="submit">Guardar</button>
      </fieldset>
    </form>
  )
}

export default App
