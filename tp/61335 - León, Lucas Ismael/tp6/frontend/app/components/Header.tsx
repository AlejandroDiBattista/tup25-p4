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
    // Sincronizar en cambios de storage (por ejemplo desde otras pestañas)
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
    <header className="w-full border-b bg-white mb-4">
      <nav className="max-w-5xl mx-auto flex items-center gap-4 p-4 text-sm">
        <Link href="/" className="font-semibold">Catálogo</Link>
        <Link href="/carrito" className="hover:underline">Carrito</Link>
        <Link href="/compras" className="hover:underline">Mis compras</Link>
        <div className="ml-auto flex gap-3">
          {token ? (
            <button onClick={logout} className="text-red-600 hover:underline">Cerrar sesión</button>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/register" className="hover:underline">Registro</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
