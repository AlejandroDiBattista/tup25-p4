import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSchoolData } from '../../context/SchoolDataContext'

const byLastName = (a, b) =>
  a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)

function ClassDetail() {
  const { classId } = useParams()
  const { classes, students, enrollStudentToClass } = useSchoolData()
  const course = classes.find((item) => item.id === classId)
  const [selectedStudent, setSelectedStudent] = useState('')

  const { enrolledStudents, availableStudents } = useMemo(() => {
    if (!course) {
      return { enrolledStudents: [], availableStudents: [] }
    }
    const enrolled = students
      .filter((student) => course.studentIds.includes(student.id))
      .sort(byLastName)
    const available = students
      .filter((student) => !course.studentIds.includes(student.id))
      .sort(byLastName)
    return { enrolledStudents: enrolled, availableStudents: available }
  }, [course, students])

  if (!course) {
    return (
      <section className="screen">
        <header className="screen-header">
          <h1>Clase no encontrada</h1>
          <Link className="btn" to="/clases">
            Volver al listado
          </Link>
        </header>
      </section>
    )
  }

  const handleAddStudent = (event) => {
    event.preventDefault()
    if (!selectedStudent) {
      return
    }
    enrollStudentToClass(selectedStudent, course.id)
    setSelectedStudent('')
  }

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <h1>
            {course.subject} · {course.commission}
          </h1>
          <p className="screen-subtitle">{course.schedule.length} encuentros semanales</p>
        </div>
        <div className="header-actions">
          <Link className="btn" to="/clases">
            Al listado
          </Link>
          <Link className="btn primary" to="editar">
            Editar datos
          </Link>
        </div>
      </header>

      <div className="panel">
        <h2>Horarios</h2>
        <ul className="schedule-list">
          {course.schedule.map((slot, index) => (
            <li key={`${slot.day}-${index}`}>
              <span className="schedule-day">{slot.day}</span>
              <span className="schedule-hour">
                {slot.startTime} - {slot.endTime}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <section>
        <header className="section-header">
          <h2>Alumnos ({enrolledStudents.length})</h2>
        </header>
        <ul className="chips">
          {enrolledStudents.map((student) => (
            <li key={student.id}>
              <Link className="chip" to={`/alumnos/${student.id}`}>
                {student.lastName}, {student.firstName}
              </Link>
            </li>
          ))}
          {!enrolledStudents.length && <li className="empty">Sin alumnos asignados.</li>}
        </ul>

        <form className="panel add-student" onSubmit={handleAddStudent}>
          <label>
            <span>Agregar alumno</span>
            <select
              value={selectedStudent}
              onChange={(event) => setSelectedStudent(event.target.value)}
            >
              <option value="">Selecciona un alumno disponible</option>
              {availableStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.lastName}, {student.firstName}
                </option>
              ))}
            </select>
          </label>
          <button className="btn primary" disabled={!availableStudents.length} type="submit">
            Asignar a la clase
          </button>
        </form>
      </section>
    </section>
  )
}

export default ClassDetail
