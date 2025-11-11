'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function Header() {
  const { usuario, isAutenticado, cerrarSesion } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await cerrarSesion();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Venti Indumentaria</h1>

        <nav className="flex items-center gap-4">
          {isAutenticado ? (
            <>
              <span className="text-gray-700">
                Bienvenido, <strong>{usuario?.nombre}</strong>
              </span>
              <Button
                variant="destructive"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Button
              onClick={() => router.push('/auth')}
            >
              Iniciar sesión
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
