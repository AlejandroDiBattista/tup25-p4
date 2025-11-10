'use client';

import { useState, useEffect, useMemo } from 'react';
import { obtenerProductos, Producto } from './services/productos';
import ProductoCard from './components/ProductoCard';
import CartSidebar from './components/CartSidebar';
import SearchFilters from './components/SearchFilters';
import useAuthStore from './store/auth';
import useCartStore from './store/cart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { user, logout } = useAuthStore();
  const { itemCount, clearCart } = useCartStore();
  const router = useRouter();

  const handleLogout = () => {
    clearCart();
    logout();
    router.push('/');
  };

  useEffect(() => {
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

  useEffect(() => {
    // Sincronizar carrito con backend cuando hay usuario
    if (user) {
      const { syncWithBackend } = useCartStore.getState();
      syncWithBackend();
    }
  }, [user]);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = productos.map(p => p.categoria);
    return Array.from(new Set(cats)).sort();
  }, [productos]);

  // Filtrar productos
  const productosFiltrados = useMemo(() => {
    let filtered = productos;

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        (p.nombre?.toLowerCase().includes(term) || 
         p.titulo?.toLowerCase().includes(term) ||
         p.descripcion?.toLowerCase().includes(term))
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(p => p.categoria === selectedCategory);
    }

    return filtered;
  }, [productos, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TP6 Shop</h1>
              <p className="text-gray-600 mt-1">
                Catálogo de productos
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
                    {user.nombre}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600">
                    Ingresar
                  </Link>
                  <Link 
                    href="/registro" 
                    className="text-gray-700 hover:text-blue-600"
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
          <>
            {/* Búsqueda y Filtros */}
            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              resultCount={productosFiltrados.length}
            />

            {/* Grid de productos */}
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-6xl mb-4">🔍</p>
                <p className="text-xl text-gray-600 mb-2">No se encontraron productos</p>
                <p className="text-gray-500">Intenta con otros términos de búsqueda o filtros</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productosFiltrados.map((producto) => (
                  <ProductoCard key={producto.id} producto={producto} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
