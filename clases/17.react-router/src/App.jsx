import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import { SchoolDataProvider } from './context/SchoolDataContext'
import ClassDetail from './routes/classes/ClassDetail'
import ClassForm from './routes/classes/ClassForm'
import ClassesList from './routes/classes/ClassesList'
import StudentDetail from './routes/students/StudentDetail'
import StudentForm from './routes/students/StudentForm'
import StudentsList from './routes/students/StudentsList'

function App() {
  return (
    <SchoolDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="alumnos" replace />} />
            <Route path="alumnos">
              <Route index element={<StudentsList />} />
              <Route path="nuevo" element={<StudentForm mode="create" />} />
              <Route path=":studentId">
                <Route index element={<StudentDetail />} />
                <Route path="editar" element={<StudentForm mode="edit" />} />
              </Route>
            </Route>
            <Route path="clases">
              <Route index element={<ClassesList />} />
              <Route path="nuevo" element={<ClassForm mode="create" />} />
              <Route path=":classId">
                <Route index element={<ClassDetail />} />
                <Route path="editar" element={<ClassForm mode="edit" />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="alumnos" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SchoolDataProvider>
  )
}

export default App
