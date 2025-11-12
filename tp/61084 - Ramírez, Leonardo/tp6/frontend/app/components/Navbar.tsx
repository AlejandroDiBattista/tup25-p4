'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';

export function Navbar() {
  const { usuario, cerrarSesion } = useAuth();
  const { items } = useCarrito();
  const cantidadCarrito = items.reduce((sum: number, item: any) => sum + item.cantidad, 0);

  const handleCerrarSesion = async () => {
    await cerrarSesion();
    window.location.href = '/';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          🛍️ E-Commerce
        </Link>

        <div className="flex gap-4 items-center">
          {usuario ? (
            <>
              <span className="text-sm">{usuario.email}</span>
              <Link href="/carrito" className="relative">
                🛒 Carrito ({cantidadCarrito})
              </Link>
              <Link href="/compras" className="hover:underline">
                Mis compras
              </Link>
              <button
                onClick={handleCerrarSesion}
                className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" className="hover:underline">
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
