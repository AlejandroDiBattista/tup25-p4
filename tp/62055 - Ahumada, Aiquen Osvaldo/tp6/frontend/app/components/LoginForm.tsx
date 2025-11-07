"use client";

import { useState } from 'react';
import { iniciarSesion } from '../services/auth';

export default function LoginForm({ onLogin }: { onLogin: (token: string, user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validación simple de email
  function validateEmail(email: string) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('El correo no tiene un formato válido.');
      return;
    }
    if (!password) {
      setError('La contraseña no puede estar vacía.');
      return;
    }
    setLoading(true);
    try {
      const { access_token, user } = await iniciarSesion(email, password);
      onLogin(access_token, user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="max-w-md mx-auto bg-white p-8 rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Iniciar sesión</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Correo</label>
        <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Contraseña</label>
        <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded font-bold" disabled={loading}>
        {loading ? 'Ingresando...' : 'Entrar'}
      </button>
    </form>
  );
}
