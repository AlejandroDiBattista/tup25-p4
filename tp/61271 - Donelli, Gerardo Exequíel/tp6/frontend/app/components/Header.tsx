'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { usuario, estaAutenticado, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">
                E-Commerce
              </span>
            </Link>
            
            {estaAutenticado && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
                >
                  Productos
                </Link>
                <Link
                  href="/compras"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-indigo-600"
                >
                  Mis Compras
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {estaAutenticado ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Hola, {usuario?.nombre}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
