"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLogged, setIsLogged] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(localStorage.getItem('tp6_token'));
  });

  const [userName, setUserName] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('tp6_user');
      if (raw) {
        const u = JSON.parse(raw);
        return u?.nombre || u?.email || null;
      }
    } catch {
      // ignore parse errors
    }
    return null;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Evitar alertas automáticas de Next.js en modo dev cuando hay mismatch de server/client
    // (ej. "Please refresh the page and try again"). Sobrescribimos temporalmente window.alert
  const originalAlert = window.alert.bind(window) as typeof window.alert;
  window.alert = (message?: unknown) => {
      try {
        const text = String(message ?? '');
        if (text.includes('Please refresh the page and try again')) {
          console.debug('[Navbar] suppressed Next.js alert:', text);
          return;
        }
      } catch {
        // ignore
      }
      originalAlert(message);
    };

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tp6_token');
      localStorage.removeItem('tp6_user');
    }
    setIsLogged(false);
    setUserName(null);
    window.location.href = '/';
  };

  return (
    <nav className="w-full bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50 flex justify-between items-center px-6 py-3">
      <div className="text-xl font-semibold text-sky-600">🛍️ De Todo Un Poco</div>

      <div className="flex gap-4 items-center">
        <Link href="/" className="hover:text-sky-600">Inicio</Link>
        {!isLogged ? (
          <>
            <Link href="/login" className="hover:text-sky-600">Ingresar</Link>
            <Link href="/registro" className="hover:text-sky-600">Crear usuario</Link>
          </>
        ) : (
          <>
            <span className="text-sm text-slate-600">Hola, {userName}</span>
            <Link href="/compras" className="hover:text-sky-600">Mis compras</Link>
            <button onClick={handleLogout} className="text-red-500 hover:underline">Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}
