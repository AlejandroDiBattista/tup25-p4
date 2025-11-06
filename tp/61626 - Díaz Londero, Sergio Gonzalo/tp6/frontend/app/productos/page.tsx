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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md mr-4"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Todas las categorías</option>
          <option value="Ropa de hombre">Ropa de hombre</option>
          <option value="electrónicos">Electrónicos</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productos.map((producto) => (
          <div key={producto.id} className="border rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold">{producto.nombre}</h3>
            <p className="text-gray-600 mt-2">{producto.descripcion}</p>
            <p className="text-xl font-bold mt-2">${producto.precio.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">
              Disponible: {producto.existencia}
            </p>
            <button
              onClick={() => handleAddToCart(producto.id)}
              disabled={producto.existencia === 0}
              className={`mt-4 w-full py-2 px-4 rounded-md ${
                producto.existencia > 0
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {producto.existencia > 0 ? 'Agregar al carrito' : 'Agotado'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}