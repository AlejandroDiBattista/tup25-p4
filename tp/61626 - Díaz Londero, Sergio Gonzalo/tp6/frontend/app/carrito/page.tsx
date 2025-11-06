'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, removeFromCart, checkout, cancelCart } from '@/api';

interface ItemCarrito {
  producto_id: number;
  cantidad: number;
  nombre: string;
  precio: number;
  iva?: number;
}

interface CarritoResponse {
  items: ItemCarrito[];
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
}

export default function CarritoPage() {
  const [carrito, setCarrito] = useState<CarritoResponse | null>(null);
  const [direccion, setDireccion] = useState('');
  const [tarjeta, setTarjeta] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      const data = await getCart();
      // data expected: { items: [{producto_id,nombre,precio,cantidad,iva}], subtotal, iva, envio, total }
      setCarrito(data);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar el carrito');
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productoId: number) => {
    try {
      await removeFromCart(productoId);
      await cargarCarrito();
    } catch (error: any) {
      alert('Error al eliminar el producto: ' + (error?.message || error));
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await checkout(direccion, tarjeta);
      alert('Compra realizada con éxito');
      router.push('/compras');
    } catch (error: any) {
      alert('Error al procesar la compra: ' + (error?.message || error));
    }
  };

  const handleCancel = async () => {
    try {
      await cancelCart();
      router.push('/productos');
    } catch (error: any) {
      alert('Error al cancelar el carrito: ' + (error?.message || error));
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (loading === false && (!carrito || carrito.items.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <button
          onClick={() => router.push('/productos')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Finalizar compra</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resumen del carrito */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-6">Resumen del carrito</h3>
          {carrito!.items.map((item) => (
            <div key={item.producto_id} className="mb-4 pb-4 border-b last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-900">{item.nombre}</span>
                  <div className="text-gray-500 text-sm">Cantidad: {item.cantidad}</div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">${Number(item.precio * item.cantidad).toFixed(2)}</span>
                  <div className="text-xs text-gray-400">IVA: ${item.iva ? Number(item.iva).toFixed(2) : '-'}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-6 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Total productos:</span>
              <span>${Number(carrito!.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>IVA:</span>
              <span>${Number(carrito!.iva).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Envío:</span>
              <span>${Number(carrito!.envio).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total a pagar:</span>
              <span>${Number(carrito!.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
        {/* Datos de envío */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-6">Datos de envío</h3>
          <form onSubmit={handleCheckout} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                required
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-gray-500 focus:outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarjeta</label>
              <input
                type="text"
                required
                value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-gray-500 focus:outline-none text-gray-900"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg bg-gray-900 text-white font-semibold shadow hover:bg-gray-800 transition"
            >
              Confirmar compra
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-2 px-4 rounded-lg bg-gray-200 text-gray-800 font-semibold shadow hover:bg-gray-300 transition mt-2"
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}