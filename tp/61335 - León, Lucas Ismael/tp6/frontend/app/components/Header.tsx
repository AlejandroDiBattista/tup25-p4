"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Header() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });

  useEffect(() => {
    function sync(e: StorageEvent) {
      if (e.key === 'token') {
        setToken(localStorage.getItem('token'));
      }
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  async function logout() {
    const current = localStorage.getItem('token');
    if (current) {
      try {
        await fetch(`${API_URL}/cerrar-sesion`, { method: 'POST', headers: { Authorization: `Bearer ${current}` } });
      } catch {}
    }
    localStorage.removeItem('token');
    setToken(null);
    router.push('/');
  }

  return (
    <header className="w-full border-b bg-white">
      <nav className="max-w-6xl mx-auto flex items-center gap-6 px-4 py-3 text-sm">
        <Link href="/" className="font-semibold text-base tracking-tight">TP6 Shop</Link>
        <Link href="/" className="text-gray-700 hover:text-black transition">Productos</Link>
        {token && <Link href="/compras" className="text-gray-700 hover:text-black transition">Mis compras</Link>}
        <div className="ml-auto flex items-center gap-3">
          {token ? (
            <>
              <button onClick={logout} className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-800">Salir</button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-800">Ingresar</Link>
              <Link href="/register" className="px-3 py-1.5 rounded bg-gray-800 text-white hover:bg-black">Crear cuenta</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
