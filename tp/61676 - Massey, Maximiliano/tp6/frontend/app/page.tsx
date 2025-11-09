'use client';

import { useState, useEffect } from 'react';
import { obtenerProductos, Producto } from './services/productos';
import ProductoCard from './components/ProductoCard';
import CartSidebar from './components/CartSidebar';
import useAuthStore, { loadAuthFromStorage } from './store/auth';
import useCartStore from './store/cart';
import Link from 'next/link';

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const { itemCount } = useCartStore();

  useEffect(() => {
    // Cargar sesión desde localStorage
    loadAuthFromStorage();
    
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TP6 Shop</h1>
              <p className="text-gray-600 mt-1">
                {productos.length} productos disponibles
              </p>
            </div>
            
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Productos
              </Link>
              
              {/* Botón del Carrito */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                🛒 Carrito
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
              
              {user ? (
                <>
                  <Link href="/mis-compras" className="text-gray-700 hover:text-blue-600">
                    Mis compras
                  </Link>
                  <span className="text-gray-700">
                    Hola, {user.nombre}
                  </span>
                  <button
                    onClick={() => clearAuth()}
                    className="text-red-600 hover:text-red-800"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-blue-600 hover:text-blue-800">
                    Ingresar
                  </Link>
                  <Link 
                    href="/registro" 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Crear cuenta
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
