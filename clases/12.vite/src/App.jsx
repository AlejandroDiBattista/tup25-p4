import { useState } from 'react'
import './App.css'
import Topbar from './components/Topbar'
import ContactSection from './components/ContactSection'
import { loadAlumnos } from './services/alumnos'
import { norm, cmpNombre, includesContacto } from './utils/text'

function App() {
  const [contactos, setContactos] = useState(() => loadAlumnos())
  const [busqueda, setBusqueda] = useState('')
  // Modo solo lectura y datos desde alumnos.vcf

  // Derivados sin useMemo
  const term = norm(busqueda.trim())
  const base = term
    ? contactos.filter((c) => includesContacto(c, term))
    : contactos
  const grupos = {
    favoritos: base.filter((c) => c.favorito).sort(cmpNombre),
    normales: base.filter((c) => !c.favorito).sort(cmpNombre),
  }

  function toggleFavorito(id) {
    setContactos((prev) => prev.map((c) => (c.id === id ? { ...c, favorito: !c.favorito } : c)))
  }

  // No hay acciones de creación/edición/borrado/favoritos en modo solo lectura

  return (
    <div className="app">
      <Topbar title="Alumnos Programación 4" searchValue={busqueda} onSearchChange={setBusqueda} />

      {grupos.normales.length === 0 && grupos.favoritos.length === 0 ? (
        <p className="empty">No hay contactos para mostrar.</p>
      ) : (
        <>
          <ContactSection
            title={grupos.favoritos.length > 0 ? 'Favoritos' : undefined}
            contacts={grupos.favoritos}
            onToggleFavorite={toggleFavorito}
          />
          <ContactSection
            title={grupos.normales.length > 0 ? 'Contactos' : undefined}
            contacts={grupos.normales}
            onToggleFavorite={toggleFavorito}
          />
        </>
      )}
    </div>
  )
}

export default App
