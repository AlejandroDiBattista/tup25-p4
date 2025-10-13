import { Link, useParams } from 'react-router-dom'
import { useSchoolData } from '../../context/SchoolDataContext'

function StudentDetail() {
  const { studentId } = useParams()
  const { students, classes } = useSchoolData()
  const student = students.find((item) => item.id === studentId)

  if (!student) {
    return (
      <section className="screen">
        <header className="screen-header">
          <h1>Alumno no encontrado</h1>
          <Link className="btn" to="/alumnos">
            Volver al listado
          </Link>
        </header>
      </section>
    )
  }

  const studentClasses = classes.filter((cls) => student.classIds.includes(cls.id))

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <h1>
            {student.firstName} {student.lastName}
          </h1>
          <p className="screen-subtitle">Legajo {student.legajo}</p>
        </div>
        <div className="header-actions">
          <Link className="btn" to="/alumnos">
            Mostrar todos los alumnos
          </Link>
          <Link className="btn primary" to="editar">
            Editar ficha
          </Link>
        </div>
      </header>

      <div className="panel">
        <dl className="data-grid">
          <div>
            <dt>Nombre</dt>
            <dd>{student.firstName}</dd>
          </div>
          <div>
            <dt>Apellido</dt>
            <dd>{student.lastName}</dd>
          </div>
          <div>
            <dt>Legajo</dt>
            <dd>{student.legajo}</dd>
          </div>
          <div>
            <dt>Usuario de GitHub</dt>
            <dd>
              <a
                className="link"
                href={`https://github.com/${student.github}`}
                target="_blank"
                rel="noreferrer"
              >
                @{student.github}
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <section>
        <h2>Clases asignadas ({studentClasses.length})</h2>
        <ul className="chips">
          {studentClasses.map((cls) => (
            <li key={cls.id}>
              <Link className="chip" to={`/clases/${cls.id}`}>
                {cls.subject} · {cls.commission}
              </Link>
            </li>
          ))}
          {!studentClasses.length && <li className="empty">Sin clases asignadas.</li>}
        </ul>
      </section>
    </section>
  )
}

export default StudentDetail
