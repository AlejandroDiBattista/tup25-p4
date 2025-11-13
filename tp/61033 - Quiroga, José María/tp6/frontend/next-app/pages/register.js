import { useState } from 'react'
import Navbar from '../components/Navbar'
import { register } from '../lib/api'

export default function Register(){
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    const res = await register({ nombre, email, password })
    if(res && res.email){
      alert('Registrado correctamente'); window.location.href='/login'
    } else {
      alert('Error al registrar')
    }
  }

  return (
    <div>
      <Navbar />
      <main className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Registrarse</h1>
        <form onSubmit={handleSubmit} className="max-w-md">
          <label className="block">Nombre</label>
          <input className="w-full border p-2 rounded mb-2" value={nombre} onChange={e=>setNombre(e.target.value)} />
          <label className="block">Email</label>
          <input className="w-full border p-2 rounded mb-2" value={email} onChange={e=>setEmail(e.target.value)} />
          <label className="block">Contraseña</label>
          <input type="password" className="w-full border p-2 rounded mb-4" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="px-4 py-2 bg-green-600 text-white rounded">Crear cuenta</button>
        </form>
      </main>
    </div>
  )
}
