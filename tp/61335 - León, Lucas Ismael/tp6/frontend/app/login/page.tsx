"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new URLSearchParams();
      form.set('username', email);
      form.set('password', password);
      const res = await fetch(`${API_URL}/iniciar-sesion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      });
      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm border rounded p-6 bg-white flex flex-col gap-3">
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>
  <input className="border px-3 py-2 rounded" placeholder="Email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
  <input className="border px-3 py-2 rounded" placeholder="Contraseña" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
