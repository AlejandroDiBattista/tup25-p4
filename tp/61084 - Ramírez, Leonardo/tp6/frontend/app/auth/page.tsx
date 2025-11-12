'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { registrar, iniciarSesion } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        await registrar(email, password, nombre);
        setSuccess('✅ Registrado correctamente. Ahora inicia sesión.');
        setEmail('');
        setPassword('');
        setNombre('');
        setTimeout(() => {
          setIsRegistering(false);
          setSuccess('');
        }, 2000);
      } else {
        await iniciarSesion(email, password);
        router.push('/');
      }
    } catch (err: any) {
      setError('❌ ' + (err.message || 'Error en la autenticación'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        {/* Título */}
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">
          {isRegistering ? '📝 Registrarse' : '🔐 Iniciar sesión'}
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          {isRegistering ? 'Crea tu cuenta para comprar' : 'Accede a tu cuenta'}
        </p>

        {/* Mensajes de error y éxito */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            <p className="font-semibold text-sm">{success}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                👤 Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Tu nombre completo"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 text-gray-900 placeholder-gray-400 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              ✉️ Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 text-gray-900 placeholder-gray-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              🔑 Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 text-gray-900 placeholder-gray-400 transition"
            />
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Cargando...
              </span>
            ) : isRegistering ? (
              '✓ Registrarse'
            ) : (
              '✓ Iniciar sesión'
            )}
          </button>
        </form>

        {/* Toggle entre registro y login */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-700 text-sm mb-3">
            {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          </p>
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setSuccess('');
            }}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline transition"
          >
            {isRegistering ? '← Inicia sesión aquí' : '→ Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}
