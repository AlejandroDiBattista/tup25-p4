"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    setLogged(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLogged(false);
    window.location.href = '/auth';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-gray-900">TP6 Shop</Link>
          <Link href="/productos" className="text-sm text-gray-600 hover:text-gray-900">Productos</Link>
          <Link href="/compras" className="text-sm text-gray-600 hover:text-gray-900">Mis compras</Link>
        </div>

        <div className="flex items-center gap-4">
          {logged ? (
            <>
              <Link href="/carrito" className="text-sm text-gray-600 hover:text-gray-900">Carrito</Link>
              <button onClick={handleLogout} className="text-sm text-indigo-600">Salir</button>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-sm text-gray-600 hover:text-gray-900">Ingresar</Link>
              <Link href="/auth" className="text-sm text-white bg-indigo-600 px-3 py-1 rounded">Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
