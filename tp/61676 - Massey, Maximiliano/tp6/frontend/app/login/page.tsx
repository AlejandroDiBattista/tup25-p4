'use client';

import { FormEvent, useState } from 'react'
import useAuthStore from '../store/auth'
import { useRouter } from 'next/navigation'
import { API_URL } from '../config'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const setAuth = useAuthStore(state => state.setAuth)
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const formData = new FormData()
            formData.append('username', email)
            formData.append('password', password)

            const response = await fetch(`${API_URL}/token`, {
                method: 'POST',
                body: formData,
                signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || 'Credenciales incorrectas')
            }

            const data = await response.json()
            setAuth(data.access_token, data.user)
            
            // Mostrar mensaje de éxito
            console.log('✅ Login exitoso:', data.user.nombre)
            
            router.push('/')
        } catch (err: any) {
            console.error('❌ Error en login:', err)
            if (err.name === 'TimeoutError' || err.message.includes('fetch')) {
                setError('Servidor no disponible. Intenta más tarde.')
            } else {
                setError(err.message || 'Error al iniciar sesión')
            }
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Iniciar sesión</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Correo
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Entrar
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link href="/registro" className="text-blue-600 hover:underline">
                        ¿No tienes cuenta? Regístrate
                    </Link>
                </div>
            </div>
        </div>
    )
}
