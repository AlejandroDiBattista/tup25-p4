'use client';

import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  stock: number;
  descripcion?: string;
  categoria: string;
  tipo_iva: string;
}

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Memoized filtered products to avoid recalculating on every render
  const filteredProductos = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter((p) =>
      p.nombre.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q)
    );
  }, [productos, query]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/productos/');
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error('Error fetching productos:', err);
        setError('No se pudieron cargar los productos. Verifica que el backend esté en http://127.0.0.1:8000');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Nuestros productos</h1>
        <p className="text-gray-600 mb-8">Descubre nuestra colección de ropa y accesorios</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <SearchBar query={query} onChange={setQuery} />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow h-96 animate-pulse" />
            ))}
          </div>
        ) : productos.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg">No hay productos disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProductos.length === 0 ? (
              <div className="col-span-full bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500">No se encontraron productos para "{query}".</p>
              </div>
            ) : (
              filteredProductos.map((p) => (
                <ProductCard
                  key={p.id}
                  producto={{
                    id: p.id,
                    nombre: p.nombre,
                    precio: p.precio,
                    imagen: p.imagen,
                    disponible: p.stock,
                    descripcion: p.descripcion,
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
