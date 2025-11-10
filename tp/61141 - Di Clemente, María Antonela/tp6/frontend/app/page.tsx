'use client';
import { obtenerProductos } from './services/productos';
import ProductoCard from './components/ProductoCard';
import { useState, useEffect } from 'react';

export default function Home() {
  // Estados
  const [productos, setProductos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState("Todas las categorias");

  // Cargar productos al montar el componente
  useEffect(() => {
    const cargarProductos = async () => {
      const data = await obtenerProductos();
      setProductos(data);
    };
    cargarProductos();
  }, []);

  // Filtrar productos por búsqueda y categoría
const productosFiltrados = (productos || []).filter((p) => {
    const nombre = p?.nombre?.toLowerCase() || "";
    const coincideBusqueda = nombre.includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoria === "Todas las categorias"
    return coincideBusqueda && coincideCategoria;
  });

  const categorias = ["Todas las categorias", ...new Set(productos.map((p) => p.categoria))];

 return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900 font-serif tracking-tight">TP6 Shop</h1>
            <nav className="flex gap-4">
            <button className="text-gray-700 hover:text-blue-600">Productos</button>
            <button className="text-gray-700 hover:text-blue-600">Ingresar</button>
            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Crear cuenta
            </button>
          </nav>
        </div>
      </header>

      {/* BUSCADOR Y CATEGORÍAS */}
      <section className="max-w-7xl mx-auto px-6 mt-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categorias.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </section>

      {/* LISTADO DE PRODUCTOS + CARRITO */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lista de productos */}
        <div className="lg:col-span-3 space-y-4">
          {productosFiltrados.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block bg-white rounded-lg shadow p-4 text-gray-700">
          <p>Inicia sesión para ver y editar tu carrito.</p>
        </aside>
      </main>
    </div>
  );
}