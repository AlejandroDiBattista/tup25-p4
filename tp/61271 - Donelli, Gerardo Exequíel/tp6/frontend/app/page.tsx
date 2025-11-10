'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { estaAutenticado, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && !estaAutenticado) {
      router.push('/auth/login');
    }
  }, [estaAutenticado, cargando, router]);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!estaAutenticado) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Bienvenido a la Tienda
      </h1>
      <p className="text-gray-600">
        Explora nuestros productos y realiza tus compras.
      </p>
      {/* Los productos se implementarán en el siguiente commit */}
    </div>
  );
}
