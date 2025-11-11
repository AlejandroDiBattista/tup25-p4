'use client';

import { useEffect, useState } from 'react';
import { obtenerProductos } from './services/productos';
import ProductoCard from './components/ProductoCard';
import { Navbar } from './components/Navbar';

interface Producto {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  valoracion: number;
  precio: number;
  existencia: number;
  imagen: string;
}

export default function Page() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [usuario, setUsuario] = useState<{ nombre: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = (await obtenerProductos()) as Producto[];
        setProductos(data || []);
        setProductosFiltrados(data || []);
      } catch (err) {
        console.error('Error al obtener productos:', err);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) setUsuario({ nombre: 'Usuario demo' });
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setProductosFiltrados(productos);
      return;
    }

    const filtrados = productos.filter((p) =>
      `${p.titulo} ${p.categoria}`.toLowerCase().includes(query)
    );
    setProductosFiltrados(filtrados);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600">
        Cargando productos...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 p-8">
      <Navbar onSearch={handleSearch} />

      <div className="flex gap-6 items-start mt-6">
        <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productosFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No se encontraron productos
            </p>
          ) : (
            productosFiltrados.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))
          )}
        </section>

        <aside className="w-80">
          {/* Aquí luego irá tu componente <Carrito /> */}
        </aside>
      </div>
    </main>
  );
}
