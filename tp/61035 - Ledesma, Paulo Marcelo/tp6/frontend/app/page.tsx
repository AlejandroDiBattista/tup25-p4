'use client';
import { useEffect, useState } from 'react';
import ProductoCard from './components/ProductoCard';
import { Carrito } from './components/Carrito';

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

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/productos`);
        const data: Producto[] = await res.json();
        setProductos(data || []);
        setProductosFiltrados(data || []);
        const cats = Array.from(new Set(data.map((p) => p.categoria)));
        setCategorias(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (busqueda.trim()) queryParams.append('buscar', busqueda.trim());
    if (categoriaSeleccionada) queryParams.append('categoria', categoriaSeleccionada);

    try {
      const res = await fetch(`${API_URL}/productos?${queryParams.toString()}`);
      const data: Producto[] = await res.json();
      setProductosFiltrados(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="flex flex-col gap-6 p-6 min-h-screen">
      <div className="flex gap-6">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="flex gap-2 mb-6 flex-wrap items-center">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar productos..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded-lg">
              Buscar
            </button>
            <button
              type="button"
              onClick={() => {
                setBusqueda('');
                setCategoriaSeleccionada('');
                setProductosFiltrados(productos);
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            >
              Mostrar todos
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <p>Cargando productos...</p>
            ) : productosFiltrados.length === 0 ? (
              <p>No se encontraron productos</p>
            ) : (
              productosFiltrados.map((p) => <ProductoCard key={p.id} producto={p} />)
            )}
          </div>
        </div>

        <aside className="w-80">
          <Carrito />
        </aside>
      </div>
    </main>
  );
}
