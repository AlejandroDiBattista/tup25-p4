'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store';
import { useCarritoStore } from '@/store';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export function Navbar() {
  const router = useRouter();
  const { usuario, logout } = useAuthStore();
  const { items } = useCarritoStore();
  const cantidadCarrito = items.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLogout = async () => {
    try {
      await apiClient.cerrarSesion();
      logout();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      logout();
      router.push('/');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-pink-600">
          TiendaTech
        </Link>

        {/* Navegación central */}
        <div className="flex gap-6">
          <Link href="/" className="text-gray-700 hover:text-pink-600 transition">
            Inicio
          </Link>
          {usuario && (
            <Link href="/compras" className="text-gray-700 hover:text-pink-600 transition">
              Mis Compras
            </Link>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-4 items-center">
          {/* Carrito */}
          <Link href="/carrito" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-pink-600 transition" />
            {cantidadCarrito > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cantidadCarrito}
              </span>
            )}
          </Link>

          {/* Autenticación */}
          {usuario ? (
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="text-sm">{usuario.nombre}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex gap-2 items-center bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          ) : (
              <div className="flex gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-pink-600 transition"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
