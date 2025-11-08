'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [nombre, setNombre] = useState<string | null>(null);

  if (pathname !== '/') return null;

  useEffect(() => {
    const load = () => {
      const t = localStorage.getItem('token');
      const nom =
        localStorage.getItem('usuario_nombre') ||
        JSON.parse(localStorage.getItem('user') || 'null')?.nombre ||
        null;
      setIsAuth(!!t);
      setNombre(nom);
    };
    load();
    const onStorage = () => load();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_nombre');
    localStorage.removeItem('user');
    setIsAuth(false);
    setNombre(null);
    router.push('/auth/login');
  };

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Parcial Ecommerce</Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm">Inicio</Link>
          <Link href="/compras" className="text-sm hover:text-blue-600">Mis compras</Link>

          {!isAuth ? (
            <>
              <Link href="/auth/login" className="text-sm">Iniciar sesión</Link>
              <Link href="/auth/registro" className="text-sm">Registrarse</Link>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-700">
                Bienvenido{nombre ? `, ${nombre}` : ''}!
              </span>
              <button onClick={logout} className="text-sm text-red-600">Cerrar sesión</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}