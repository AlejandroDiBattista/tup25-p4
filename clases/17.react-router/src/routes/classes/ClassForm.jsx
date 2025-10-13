import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSchoolData } from '../../context/SchoolDataContext'

const defaultSlot = { day: 'Lunes', startTime: '18:00', endTime: '20:00' }

const buildEmptyClass = () => ({
  subject: 'Programacion 3',
  commission: 'C1',
  schedule: [{ ...defaultSlot }],
  studentIds: [],
})

function ClassForm({ mode }) {
  const isEdit = mode === 'edit'
  const navigate = useNavigate()
  const { classId } = useParams()
  const { classes, students, addClass, updateClass } = useSchoolData()
  const existing = classes.find((cls) => cls.id === classId)

  const initialState = useMemo(() => {
    if (isEdit) {
      if (!existing) {
        return buildEmptyClass()
      }
      return {
        ...existing,
        schedule: existing.schedule.map((slot) => ({ ...slot })),
        studentIds: [...existing.studentIds],
      }
    }
    return buildEmptyClass()
  }, [existing, isEdit])

  const [formData, setFormData] = useState(initialState)

  useEffect(() => {
    setFormData(initialState)
  }, [initialState])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStudentToggle = (studentId) => {
    setFormData((prev) => {
      const isActive = prev.studentIds.includes(studentId)
      return {
        ...prev,
        studentIds: isActive
          ? prev.studentIds.filter((id) => id !== studentId)
          : [...prev.studentIds, studentId],
      }
    })
  }

  const handleScheduleChange = (index, field, value) => {
    setFormData((prev) => {
      const schedule = prev.schedule.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [field]: value } : slot,
      )
      return { ...prev, schedule }
    })
  }

  const handleAddSlot = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { ...defaultSlot }],
    }))
  }

  const handleRemoveSlot = (index) => {
    setFormData((prev) => {
      if (prev.schedule.length === 1) {
        return prev
      }
      const schedule = prev.schedule.filter((_, slotIndex) => slotIndex !== index)
      return { ...prev, schedule }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      subject: formData.subject.trim(),
      commission: formData.commission.trim(),
      schedule: formData.schedule,
      studentIds: formData.studentIds,
    }
    if (isEdit && existing) {
      updateClass(existing.id, payload)
    } else {
      addClass(payload)
    }
    navigate('/clases')
  }

  if (isEdit && !existing) {
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

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <h1>{isEdit ? 'Editar clase' : 'Nueva clase'}</h1>
          <p className="screen-subtitle">
            Define la cursada y asigna los estudiantes correspondientes.
          </p>
        </div>
      </header>

      <form className="panel form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span>Materia</span>
            <input
              name="subject"
              required
              value={formData.subject}
              onChange={handleInputChange}
            />
          </label>
          <label>
            <span>Comision</span>
            <input
              name="commission"
              required
              value={formData.commission}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <fieldset className="schedule-fields">
          <legend>Horarios</legend>
          {formData.schedule.map((slot, index) => (
            <div key={`${slot.day}-${index}`} className="schedule-row">
              <label>
                <span>Dia</span>
                <select
                  value={slot.day}
                  onChange={(event) => handleScheduleChange(index, 'day', event.target.value)}
                >
                  {['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Inicio</span>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(event) => handleScheduleChange(index, 'startTime', event.target.value)}
                  required
                />
              </label>
              <label>
                <span>Fin</span>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(event) => handleScheduleChange(index, 'endTime', event.target.value)}
                  required
                />
              </label>
              <button
                className="btn"
                disabled={formData.schedule.length === 1}
                onClick={() => handleRemoveSlot(index)}
                type="button"
              >
                Quitar
              </button>
            </div>
          ))}
          <button className="btn" onClick={handleAddSlot} type="button">
            Agregar horario
          </button>
        </fieldset>

        <fieldset className="checkbox-group">
          <legend>Alumnos</legend>
          <div className="checkbox-rows">
            {students.map((student) => (
              <label key={student.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.studentIds.includes(student.id)}
                  onChange={() => handleStudentToggle(student.id)}
                />
                <span>
                  {student.lastName}, {student.firstName}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-actions">
          <Link className="btn" to="/clases">
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

export default ClassForm
