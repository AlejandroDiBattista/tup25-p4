'use client';

import { useState, useEffect } from 'react';
import { getProducts, addToCart } from '@/api';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  existencia: number;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoria, setCategoria] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarProductos();
  }, [categoria, busqueda]);

  const cargarProductos = async () => {
    try {
      const data = await getProducts(categoria, busqueda);
      setProductos(data);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los productos');
      setLoading(false);
    }
  };

  const handleAddToCart = async (productoId: number) => {
    try {
      await addToCart(productoId, 1);
      alert('Producto agregado al carrito');
    } catch (error) {
      alert('Error al agregar al carrito');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Todas las categorías</option>
          <option value="Ropa de hombre">Ropa de hombre</option>
          <option value="electrónicos">Electrónicos</option>
        </select>
      </div>

      {/* Grilla de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {productos.map((producto) => (
          <div key={producto.id} className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-6 relative h-full">
            {/* Imagen */}
            <div className="w-full flex justify-center mb-4">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {/* Aquí podrías usar <Image /> si tienes la url */}
                <span className="text-gray-400 text-xs">Imagen</span>
              </div>
            </div>
            {/* Info */}
            <div className="w-full flex-1 flex flex-col justify-between">
              <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">{producto.nombre}</h3>
              <p className="text-gray-600 mb-2 text-center">{producto.descripcion}</p>
              <div className="text-sm text-gray-500 mb-2 text-center">Categoría: {producto.categoria}</div>
              <div className="flex justify-center items-center gap-4 mb-2">
                <span className="text-xl font-bold text-gray-800">${producto.precio.toFixed(2)}</span>
                <span className="text-xs text-gray-500">Stock: {producto.existencia}</span>
              </div>
            </div>
            {/* Botón */}
            <div className="w-full mt-4">
              <button
                onClick={() => handleAddToCart(producto.id)}
                disabled={producto.existencia === 0}
                className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors ${
                  producto.existencia > 0
                    ? 'bg-gray-900 hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {producto.existencia > 0 ? 'Agregar al carrito' : 'Sin stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}