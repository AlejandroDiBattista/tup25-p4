import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSchoolData } from '../../context/SchoolDataContext'

const normalize = (value) => value.trim().toLowerCase()

function StudentsList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const otro = searchParams.get('otro') ?? ''
  
  const { students } = useSchoolData()
  const normalizedQuery = normalize(query)

  const filteredStudents = students
    .filter((student) => {
      if (!normalizedQuery) {
        return true
      }
      const haystack = [
        student.firstName,
        student.lastName,
        student.legajo,
        student.github,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(normalizedQuery)
    })
    .sort((a, b) => a.lastName.localeCompare(b.lastName))

  const handleSearchChange = (event) => {
    const value = event.target.value
    if (value) {
      setSearchParams({ q: value, otro: 'parametro' })
    } else {
      setSearchParams({})
    }
  }

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <h1>Alumnos</h1>
          <p className="screen-subtitle">
            Gestiona las fichas y asignaciones de los estudiantes.
          </p>
        </div>
        <Link className="btn primary" to="nuevo">
          Agregar
        </Link>
      </header>

      <div className="screen-toolbar">
        <label className="search">
          <span className="search-label">Buscar</span>
          <input
            type="search"
            placeholder="Buscar algo"
            value={query}
            onChange={handleSearchChange}
          />
        </label>
      </div>

      <ul className="card-list">
        {filteredStudents.map((student) => (
          <li key={student.id}>
            <Link className="card" to={student.id}>
              <div className="card-title">
                {student.lastName}, {student.firstName} 🧑🏻
              </div>
              <div className="card-meta">
                Legajo {student.legajo} · GitHub @{student.github} 
              </div>
              <div>
                ID: {student.id}
              </div>
            </Link>
          </li>
        ))}
        {!filteredStudents.length && (
          <li className="empty">No encontramos resultados con esa busqueda.</li>
        )}
      </ul>
    </section>
  )
}

export default StudentsList
