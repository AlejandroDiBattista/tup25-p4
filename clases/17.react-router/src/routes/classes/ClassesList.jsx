import { Link, useSearchParams } from 'react-router-dom'
import { useSchoolData } from '../../context/SchoolDataContext'

const normalize = (value) => value.trim().toLowerCase()

const formatSchedule = (schedule) =>
  schedule
    .map((slot) => `${slot.day} ${slot.startTime}-${slot.endTime}`)
    .join(' · ')

function ClassesList() {
  const { classes, students } = useSchoolData()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const normalizedQuery = normalize(query)

  const filteredClasses = classes
    .filter((cls) => {
      if (!normalizedQuery) {
        return true
      }
      const haystack = [
        cls.subject,
        cls.commission,
        cls.schedule.map((slot) => `${slot.day} ${slot.startTime} ${slot.endTime}`).join(' '),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(normalizedQuery)
    })
    .sort((a, b) => a.subject.localeCompare(b.subject))

  const handleSearchChange = (event) => {
    const value = event.target.value
    if (value) {
      setSearchParams({ q: value })
    } else {
      setSearchParams({})
    }
  }

  const studentName = (id) => {
    const student = students.find((item) => item.id === id)
    return student ? `${student.lastName}, ${student.firstName}` : null
  }

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <h1>Clases</h1>
          <p className="screen-subtitle">
            Organiza horarios y suma estudiantes a cada cursada.
          </p>
        </div>
        <Link className="btn primary" to="nuevo">
          Agregar
        </Link>
      </header>

      <div className="screen-toolbar">
        <label className="search">
          <span className="search-label">Busqueda</span>
          <input
            type="search"
            placeholder="Busca por materia, comision u horario"
            value={query}
            onChange={handleSearchChange}
          />
        </label>
      </div>

      <ul className="card-list">
        {filteredClasses.map((cls) => {
          const firstStudent = cls.studentIds.length
            ? studentName(cls.studentIds[0])
            : 'Sin asignar'
          return (
            <li key={cls.id}>
              <Link className="card" to={cls.id}>
                <div className="card-title">
                  {cls.subject} · {cls.commission}
                </div>
                <div className="card-meta">{formatSchedule(cls.schedule)}</div>
                <div className="card-footer">
                  {cls.studentIds.length} alumnos · {firstStudent || 'Sin asignar'}
                </div>
              </Link>
            </li>
          )
        })}
        {!filteredClasses.length && (
          <li className="empty">No hay clases que coincidan con la busqueda.</li>
        )}
      </ul>
    </section>
  )
}

export default ClassesList
