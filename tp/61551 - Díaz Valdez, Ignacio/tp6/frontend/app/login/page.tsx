"use client";
import { useState, FormEvent } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); setCargando(true);
    try {
      // TODO: llamar loginUser
      await new Promise(r => setTimeout(r, 300));
      // redirect
      window.location.href = '/';
    } catch (err: any) {
      setError(err?.message || 'Error');
    } finally { setCargando(false); }
  };

  return (
    <div className="max-w-sm mx-auto py-8">
      <h1 className="text-xl font-semibold mb-4">Iniciar sesión</h1>
      <form onSubmit={submit} className="space-y-4">
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="bg-indigo-600 text-white px-4 py-2 rounded" disabled={cargando}>{cargando? 'Ingresando...' : 'Ingresar'}</button>
      </form>
      <p className="text-sm mt-4">¿No tenés cuenta? <a className="text-indigo-600 underline" href="/register">Registrate</a></p>
    </div>
  );
}
