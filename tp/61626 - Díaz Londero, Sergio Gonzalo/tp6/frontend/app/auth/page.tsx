'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, register } from '@/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const data = await login(email, password);
        localStorage.setItem('token', data.access_token);
      } else {
        await register(nombre, email, password);
        setIsLogin(true);
      }
      router.push('/productos');
    } catch (error) {
      setError('Error en la autenticación. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-gray-500 focus:outline-none text-gray-900"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-gray-500 focus:outline-none text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-gray-500 focus:outline-none text-gray-900"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-gray-900 text-white font-semibold shadow hover:bg-gray-800 transition"
              >
                {isLogin ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-sm text-gray-700 hover:text-gray-900 underline"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}