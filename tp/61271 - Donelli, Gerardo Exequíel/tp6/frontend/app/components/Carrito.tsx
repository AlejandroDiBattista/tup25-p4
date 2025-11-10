'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  obtenerCarrito,
  eliminarDelCarrito,
  cancelarCarrito,
  finalizarCompra,
  type CarritoResponse,
} from '../services/carrito';

interface CarritoProps {
  onClose: () => void;
  actualizarTrigger: number;
  onActualizar: () => void;
}

export default function Carrito({ onClose, actualizarTrigger, onActualizar }: CarritoProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [carrito, setCarrito] = useState<CarritoResponse | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  const [direccion, setDireccion] = useState('');
  const [tarjeta, setTarjeta] = useState('');
  const [procesandoCompra, setProcesandoCompra] = useState(false);

  useEffect(() => {
    cargarCarrito();
  }, [actualizarTrigger]);

  const cargarCarrito = async () => {
    if (!token) return;
    
    setCargando(true);
    try {
      const data = await obtenerCarrito(token);
      setCarrito(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar carrito');
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (productoId: number) => {
    if (!token) return;
    
    try {
      await eliminarDelCarrito(token, productoId);
      await cargarCarrito();
      onActualizar();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar producto');
    }
  };

  const handleCancelar = async () => {
    if (!token || !confirm('¿Seguro que deseas vaciar el carrito?')) return;
    
    try {
      await cancelarCarrito(token);
      await cargarCarrito();
      onActualizar();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al cancelar carrito');
    }
  };

  const handleFinalizarCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !carrito || carrito.items.length === 0) return;
    
    setProcesandoCompra(true);
    try {
      const result = await finalizarCompra(token, { direccion, tarjeta });
      alert(`¡Compra realizada exitosamente! Total: $${result.total.toFixed(2)}`);
      setMostrarCheckout(false);
      setDireccion('');
      setTarjeta('');
      await cargarCarrito();
      onActualizar();
      onClose();
      router.push('/compras');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al finalizar compra');
    } finally {
      setProcesandoCompra(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {mostrarCheckout ? 'Finalizar Compra' : 'Carrito de Compras'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {cargando ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando carrito...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          ) : !carrito || carrito.items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Tu carrito está vacío</p>
              <button
                onClick={onClose}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Continuar comprando
              </button>
            </div>
          ) : mostrarCheckout ? (
            /* Formulario de Checkout */
            <form onSubmit={handleFinalizarCompra} className="space-y-6">
              {/* Resumen del carrito */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Resumen del Pedido</h3>
                <div className="space-y-2">
                  {carrito.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.titulo} x{item.cantidad}
                      </span>
                      <span>${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 font-bold text-lg">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>${carrito.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario */}
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de envío *
                </label>
                <input
                  type="text"
                  id="direccion"
                  required
                  minLength={10}
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Calle, número, ciudad, código postal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="tarjeta" className="block text-sm font-medium text-gray-700 mb-2">
                  Últimos 4 dígitos de la tarjeta *
                </label>
                <input
                  type="text"
                  id="tarjeta"
                  required
                  minLength={4}
                  maxLength={4}
                  pattern="\d{4}"
                  value={tarjeta}
                  onChange={(e) => setTarjeta(e.target.value)}
                  placeholder="1234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Por seguridad, solo ingresa los últimos 4 dígitos
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setMostrarCheckout(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Volver al carrito
                </button>
                <button
                  type="submit"
                  disabled={procesandoCompra}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {procesandoCompra ? 'Procesando...' : 'Confirmar Compra'}
                </button>
              </div>
            </form>
          ) : (
            /* Lista de productos en el carrito */
            <div className="space-y-4">
              {carrito.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border rounded-lg p-4 hover:bg-gray-50"
                >
                  <img
                    src={item.imagen}
                    alt={item.titulo}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.titulo}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Precio: ${item.precio_unitario.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.cantidad}
                    </p>
                    <p className="text-sm text-green-600">
                      {item.existencia_disponible} disponibles
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <p className="text-lg font-bold text-indigo-600">
                      ${item.subtotal.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleEliminar(item.producto_id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!cargando && carrito && carrito.items.length > 0 && !mostrarCheckout && (
          <div className="border-t p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">
                ${carrito.total.toFixed(2)}
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleCancelar}
                className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
              >
                Vaciar carrito
              </button>
              <button
                onClick={() => setMostrarCheckout(true)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
              >
                Finalizar compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
