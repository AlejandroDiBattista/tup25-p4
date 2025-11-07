"use client";

import { useEffect, useState } from 'react';
import { useCarrito } from '../hooks/useCarrito';

export default function Carrito() {
  const { obtenerCarrito, quitarDelCarrito, finalizarCompra, cancelarCompra } = useCarrito();
  const [carrito, setCarrito] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    cargarCarrito();
  }, []);

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
    <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Carrito de compras</h2>
      {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-2">{success}</div>}
      {!carrito || !carrito.productos?.length ? (
        <div>El carrito está vacío.</div>
      ) : (
        <ul className="mb-4">
          {carrito.productos.map((item: any) => (
            <li key={item.producto_id} className="flex justify-between items-center mb-2">
              <span>{item.nombre} x {item.cantidad}</span>
              <button className="bg-red-100 px-2 py-1 rounded text-red-700" onClick={() => handleQuitar(item.producto_id)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <button className="bg-gray-200 px-4 py-2 rounded" onClick={handleCancelar}>Cancelar compra</button>
        <button className="bg-blue-900 text-white px-4 py-2 rounded" onClick={handleFinalizar}>Finalizar compra</button>
      </div>
    </div>
  );
}
