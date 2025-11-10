'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { obtenerProductos, obtenerCategorias } from './services/productos';
import { agregarAlCarrito } from './services/carrito';
import { Producto } from './types';
import Carrito from './components/Carrito';

export default function Home() {
  const { estaAutenticado, cargando, token } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [error, setError] = useState('');
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [actualizarCarrito, setActualizarCarrito] = useState(0);

  useEffect(() => {
    if (!cargando && !estaAutenticado) {
      router.push('/auth/login');
    }
  }, [estaAutenticado, cargando, router]);

  useEffect(() => {
    if (estaAutenticado) {
      cargarCategorias();
      cargarProductos();
    }
  }, [estaAutenticado]);

  useEffect(() => {
    if (estaAutenticado) {
      cargarProductos();
    }
  }, [categoriaSeleccionada, busqueda, estaAutenticado]);

  const cargarCategorias = async () => {
    try {
      const cats = await obtenerCategorias();
      setCategorias(cats);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const cargarProductos = async () => {
    setCargandoProductos(true);
    try {
      const prods = await obtenerProductos(
        categoriaSeleccionada || undefined,
        busqueda || undefined
      );
      setProductos(prods);
      setError('');
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setCargandoProductos(false);
    }
  };

  const handleAgregarAlCarrito = async (productoId: number) => {
    if (!token) return;
    
    try {
      await agregarAlCarrito(token, { producto_id: productoId, cantidad: 1 });
      setActualizarCarrito(prev => prev + 1);
      alert('Producto agregado al carrito');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al agregar al carrito');
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!estaAutenticado) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header con título y botón de carrito */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
          <p className="text-gray-600 mt-2">{productos.length} productos disponibles</p>
        </div>
        <button
          onClick={() => setCarritoVisible(!carritoVisible)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          🛒 Ver Carrito
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar productos
            </label>
            <input
              type="text"
              id="busqueda"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por categoría
            </label>
            <select
              id="categoria"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        {(categoriaSeleccionada || busqueda) && (
          <button
            onClick={() => {
              setCategoriaSeleccionada('');
              setBusqueda('');
            }}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Productos */}
      {cargandoProductos ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                <img
                  src={producto.imagen}
                  alt={producto.titulo}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {producto.titulo}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {producto.descripcion}
                </p>
                <p className="text-xs text-gray-500 mb-3">{producto.categoria}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-indigo-600">
                    ${producto.precio.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ⭐ {producto.valoracion}
                  </span>
                </div>
                {producto.existencia > 0 ? (
                  <>
                    <p className="text-sm text-green-600 mb-3">
                      {producto.existencia} disponibles
                    </p>
                    <button
                      onClick={() => handleAgregarAlCarrito(producto.id)}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Agregar al carrito
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-red-600 font-semibold mb-3">Agotado</p>
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
                    >
                      No disponible
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal del Carrito */}
      {carritoVisible && (
        <Carrito
          onClose={() => setCarritoVisible(false)}
          actualizarTrigger={actualizarCarrito}
          onActualizar={() => setActualizarCarrito(prev => prev + 1)}
        />
      )}
    </div>
  );
}
