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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Carrito de compras</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {carrito!.items.map((item) => (
            <div
              key={item.producto_id}
              className="flex items-center justify-between border-b py-4"
            >
              <div>
                <h3 className="font-semibold">{item.nombre}</h3>
                <p className="text-gray-600">
                  Cantidad: {item.cantidad} x ${Number(item.precio).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleRemoveItem(item.producto_id)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Resumen del pedido</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${Number(carrito!.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA</span>
              <span>${Number(carrito!.iva).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>${Number(carrito!.envio).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span>${Number(carrito!.total).toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dirección de envío
              </label>
              <input
                type="text"
                required
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tarjeta de crédito
              </label>
              <input
                type="text"
                required
                value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Finalizar compra
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 mt-2"
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}