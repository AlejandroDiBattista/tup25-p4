import { FormEvent, useState } from 'react'
import useAuthStore from '../store/auth'
import { useRouter } from 'next/navigation'

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

            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error('Credenciales incorrectas')
            }

            const data = await response.json()
            setAuth(data.access_token, data.user)
            router.push('/')
        } catch (err) {
            setError('Error al iniciar sesión')
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
                    <a href="/registro" className="text-blue-600 hover:underline">
                        ¿No tienes cuenta? Regístrate
                    </a>
                </div>
            </div>
        </div>
    )
}
