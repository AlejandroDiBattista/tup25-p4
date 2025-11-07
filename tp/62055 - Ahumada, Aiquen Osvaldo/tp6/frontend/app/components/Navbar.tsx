"use client";

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, signOut, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white border-b shadow-sm px-4 py-2 flex items-center justify-between">
      <div className="font-bold text-lg">TP6 Shop</div>
      <div className="flex items-center gap-4">
        <Link href="/productos" className="hover:underline">Productos</Link>
        {isAuthenticated ? (
          <>
            <Link href="/compras" className="hover:underline">Mis compras</Link>
            <span className="text-gray-700">{user?.nombre}</span>
            <button onClick={signOut} className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Salir</button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">Ingresar</Link>
            <Link href="/register" className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Crear cuenta</Link>
          </>
        )}
      </div>
    </nav>
  );
}
