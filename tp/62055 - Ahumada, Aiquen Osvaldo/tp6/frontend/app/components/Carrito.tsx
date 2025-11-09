"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCarrito } from '../hooks/useCarrito';
import { obtenerProductos } from '../services/productos';

export default function Carrito() {
  const { token } = useAuth();
  const { obtenerCarrito, quitarDelCarrito, finalizarCompra, cancelarCompra, agregarAlCarrito } = useCarrito();
  const [carrito, setCarrito] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    cargarCarrito();
    // recargar carrito cada vez que cambia el token (sesión)
  }, [token]);

  async function cargarCarrito() {
    setLoading(true);
    setError('');
    try {
      const data = await obtenerCarrito();
      setCarrito(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSumar(item: any) {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await agregarAlCarrito({ id: item.id, existencia: 1 });
      setSuccess('Cantidad aumentada');
      await cargarCarrito();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleQuitar(producto_id: number) {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await quitarDelCarrito(producto_id);
      setSuccess('Producto quitado del carrito');
      await cargarCarrito();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFinalizar() {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await finalizarCompra();
      setSuccess('Compra finalizada correctamente');
      await cargarCarrito();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelar() {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await cancelarCompra();
      setSuccess('Carrito cancelado');
      await cargarCarrito();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Cargando carrito...</div>;
  if (error) return <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>;

  return (
    <div className="bg-white p-6 rounded shadow w-full lg:w-[400px]">
      <h2 className="text-xl font-bold mb-4">Carrito de compras</h2>
      {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-2">{success}</div>}
      {!carrito || !carrito.carrito?.length ? (
        <div>El carrito está vacío.</div>
      ) : (
        <>
          <ul className="mb-4">
            {carrito.carrito.map((item: any) => (
              <li key={item.id} className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-semibold">{item.titulo}</span>
                  <span className="ml-2 text-gray-500">${item.subtotal.toFixed(2)}</span>
                  <div className="text-xs text-gray-600">{item.precio_unitario} c/u</div>
                </div>
                <div className="flex items-center gap-2">
                  <span>Cantidad: {item.cantidad}</span>
                  <button className="bg-red-100 px-2 py-1 rounded text-red-700" onClick={() => handleQuitar(item.id)}>
                    -
                  </button>
                  <button className="bg-green-100 px-2 py-1 rounded text-green-700" onClick={() => handleSumar(item)}>
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-1 text-gray-700">
              <span>Subtotal</span>
              <span>${carrito.resumen.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1 text-gray-700">
              <span>IVA</span>
              <span>${carrito.resumen.iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1 text-gray-700">
              <span>Envío</span>
              <span>${carrito.resumen.envio.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>${carrito.resumen.total.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button className="bg-gray-200 px-4 py-2 rounded" onClick={handleCancelar}>Cancelar</button>
            <button className="bg-blue-900 text-white px-4 py-2 rounded" onClick={handleFinalizar}>Continuar compra</button>
          </div>
        </>
      )}
    </div>
  );
}
