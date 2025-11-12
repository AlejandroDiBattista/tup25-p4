'use client';

import { useEffect, useState } from 'react';
import ProductoCard from './components/ProductoCard';
import { Navbar } from './components/Navbar';
import { Producto } from './types';

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const loadProductos = async () => {
      try {
        let url = `${API_URL}/productos`;
        const params = new URLSearchParams();
        if (searchTerm) params.append('buscar', searchTerm);
        if (selectedCategory) params.append('categoria', selectedCategory);
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setProductos(data);
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductos();
  }, [searchTerm, selectedCategory, API_URL]);

  const categorias = ['Ropa de hombre', 'Ropa de mujer', 'Joyería', 'Electrónica'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Catálogo de Productos
          </h1>
          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <p className="text-gray-600 mt-4">
            {isLoading ? 'Cargando...' : `${productos.length} productos disponibles`}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-8">Cargando productos...</div>
        ) : productos.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No se encontraron productos
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
