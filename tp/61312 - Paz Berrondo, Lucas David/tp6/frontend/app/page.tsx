'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductoCard from './components/ProductoCard';
import { cerrarSesion, estaAutenticado } from './services/auth';
import { obtenerProductos } from './services/productos';
import type { Producto } from './types';

export default function Home() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    setAutenticado(estaAutenticado());
    
    const cargarProductos = async () => {
      try {
        const data = await obtenerProductos();
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  const handleLogout = async () => {
    try {
      await cerrarSesion();
      setAutenticado(false);
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Catálogo de Productos
              </h1>
              <p className="text-gray-600 mt-2">
                {productos.length} productos disponibles
              </p>
            </div>
            
            <div className="flex gap-4">
              {autenticado ? (
                <>
                  <button
                    onClick={() => router.push('/carrito')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🛒 Mi Carrito
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/auth')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductoCard 
              key={producto.id} 
              producto={producto}
              autenticado={autenticado}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
