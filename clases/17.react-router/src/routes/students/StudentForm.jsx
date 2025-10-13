import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSchoolData } from '../../context/SchoolDataContext'

const emptyStudent = {
  firstName: '',
  lastName: '',
  legajo: '',
  github: '',
  classIds: [],
}

function StudentForm({ mode }) {
  const isEdit = mode === 'edit'
  const navigate = useNavigate()
  const { studentId } = useParams()
  const { students, classes, addStudent, updateStudent } = useSchoolData()
  const existing = students.find((student) => student.id === studentId)

  const initialState = useMemo(() => {
    if (isEdit) {
      return existing ? { ...existing } : emptyStudent
    }
    return emptyStudent
  }, [existing, isEdit])

  const [formData, setFormData] = useState(initialState)

  useEffect(() => {
    setFormData(initialState)
  }, [initialState])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClassToggle = (classId) => {
    setFormData((prev) => {
      const isActive = prev.classIds.includes(classId)
      return {
        ...prev,
        classIds: isActive
          ? prev.classIds.filter((id) => id !== classId)
          : [...prev.classIds, classId],
      }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      legajo: formData.legajo.trim(),
      github: formData.github.trim(),
      classIds: formData.classIds,
    }
    if (isEdit && existing) {
      updateStudent(existing.id, payload)
    } else {
      addStudent(payload)
    }
    navigate('/alumnos')
  }

  if (isEdit && !existing) {
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

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <h1>{isEdit ? 'Editar alumno' : 'Nuevo alumno'}</h1>
          <p className="screen-subtitle">
            Completa los campos y selecciona las clases asignadas.
          </p>
        </div>
      </header>

      <form className="panel form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span>Nombre</span>
            <input
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            <span>Apellido</span>
            <input
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            <span>Legajo</span>
            <input
              name="legajo"
              required
              value={formData.legajo}
              onChange={handleInputChange}
            />
          </label>
          <label>
            <span>Usuario de GitHub</span>
            <input
              name="github"
              required
              value={formData.github}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <fieldset className="checkbox-group">
          <legend>Clases</legend>
          <div className="checkbox-rows">
            {classes.map((cls) => (
              <label key={cls.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.classIds.includes(cls.id)}
                  onChange={() => handleClassToggle(cls.id)}
                />
                <span>
                  {cls.subject} · {cls.commission}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-actions">
          <Link className="btn" to="/alumnos">
            Cancelar
          </Link>
          <button className="btn primary" type="submit">
            Guardar cambios
          </button>
        </div>
      </form>
    </section>
  )
}

export default StudentForm
