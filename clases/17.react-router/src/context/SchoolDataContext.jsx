import React, { createContext, useContext, useState } from 'react'
import { initialClasses, initialStudents } from '../data/initialData'

const SchoolDataContext = createContext(null)

const unique = (values) => Array.from(new Set(values))

const createId = (prefix) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function SchoolDataProvider({ children }) {
  const [students, setStudents]  = useState(initialStudents)
  const [classes,  setClasses]   = useState(initialClasses)

  const addStudent = (payload) => {
    const id = createId('stu')
    const classIds = payload.classIds ?? []
    const student = { ...payload, id, classIds }
    setStudents((prev) => [...prev, student])
    if (classIds.length) {
      setClasses((prev) =>
        prev.map((cls) =>
          classIds.includes(cls.id)
            ? { ...cls, studentIds: unique([...cls.studentIds, id]) }
            : cls,
        ),
      )
    }
    return id
  }

  const updateStudent = (id, payload) => {
    const previous = students.find((student) => student.id === id)
    const nextClassIds = payload.classIds ?? previous?.classIds ?? []

    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              ...payload,
              classIds: nextClassIds,
            }
          : student,
      ),
    )

    setClasses((prev) =>
      prev.map((cls) => {
        const hasStudent = cls.studentIds.includes(id)
        const shouldHaveStudent = nextClassIds.includes(cls.id)
        if (hasStudent === shouldHaveStudent) {
          return cls
        }
        const studentIds = shouldHaveStudent
          ? unique([...cls.studentIds, id])
          : cls.studentIds.filter((studentId) => studentId !== id)
        return { ...cls, studentIds }
      }),
    )
  }

  const addClass = (payload) => {
    const id = createId('class')
    const studentIds = payload.studentIds ?? []
    const newClass = { ...payload, id, studentIds }
    setClasses((prev) => [...prev, newClass])
    if (studentIds.length) {
      setStudents((prev) =>
        prev.map((student) =>
          studentIds.includes(student.id)
            ? { ...student, classIds: unique([...student.classIds, id]) }
            : student,
        ),
      )
    }
    return id
  }

  const updateClass = (id, payload) => {
    const previous = classes.find((cls) => cls.id === id)
    const nextStudentIds = payload.studentIds ?? previous?.studentIds ?? []

    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === id
          ? {
              ...cls,
              ...payload,
              studentIds: nextStudentIds,
            }
          : cls,
      ),
    )

    setStudents((prev) =>
      prev.map((student) => {
        const isMember = nextStudentIds.includes(student.id)
        const wasMember = previous?.studentIds.includes(student.id)
        if (isMember === wasMember) {
          return student
        }
        const classIds = isMember
          ? unique([...student.classIds, id])
          : student.classIds.filter((classId) => classId !== id)
        return { ...student, classIds }
      }),
    )
  }

  const enrollStudentToClass = (studentId, classId) => {
    const targetClass = classes.find((cls) => cls.id === classId)
    const targetStudent = students.find((student) => student.id === studentId)
    if (!targetClass || !targetStudent) {
      return
    }
    if (!targetClass.studentIds.includes(studentId)) {
      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === classId
            ? { ...cls, studentIds: unique([...cls.studentIds, studentId]) }
            : cls,
        ),
      )
    }
    if (!targetStudent.classIds.includes(classId)) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === studentId
            ? { ...student, classIds: unique([...student.classIds, classId]) }
            : student,
        ),
      )
    }
  }

  return (
    <SchoolDataContext.Provider
      value={{
        students,
        classes,
        addStudent,
        updateStudent,
        addClass,
        updateClass,
        enrollStudentToClass,
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  )
}

export const useSchoolData = () => {
  const context = useContext(SchoolDataContext)
  if (!context) {
    throw new Error('useSchoolData must be used inside SchoolDataProvider')
  }
  return context
}
