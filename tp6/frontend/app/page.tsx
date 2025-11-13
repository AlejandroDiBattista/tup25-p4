'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { SearchBar } from '@/components/search-bar';
import { CategoryFilter } from '@/components/category-filter';
import { apiClient } from '@/lib/api-client';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  existencia: number;
  imagen_url?: string;
  es_electronico: boolean;
}

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  useEffect(() => {
    cargarProductos();
  }, [busqueda, categoriaSeleccionada]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.obtenerProductos(
        categoriaSeleccionada,
        busqueda
      );
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorias = [...new Set(productos.map((p) => p.categoria))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Bienvenido a Tienda Electrónica</h1>
          <p className="text-xl text-blue-100">Los mejores productos de electrónica y accesorios</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Búsqueda y filtros */}
        <div className="mb-8 space-y-4">
          <SearchBar onSearch={setBusqueda} />
          <CategoryFilter
            categorias={categorias}
            categoriaSeleccionada={categoriaSeleccionada}
            onSelectCategoria={setCategoriaSeleccionada}
          />
        </div>

        {/* Productos */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
