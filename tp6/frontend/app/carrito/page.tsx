'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { useCarritoStore } from '@/store';
import { apiClient } from '@/lib/api-client';
import { Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CarritoPage() {
  const router = useRouter();
  const { usuario } = useAuthStore();
  const { items, setCarrito, removeItem, clearCart } = useCarritoStore();
  const [loading, setLoading] = useState(true);
  const [carrito, setCarritoData] = useState<any>(null);

  useEffect(() => {
    if (!usuario) {
      router.push('/login');
      return;
    }
    cargarCarrito();
  }, [usuario, router]);

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const response = await apiClient.obtenerCarrito();
      setCarritoData(response.data);
      setCarrito(response.data.items, {
        total: response.data.total,
        subtotal: response.data.subtotal,
        iva: response.data.iva,
        envio: response.data.envio,
      });
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (producto_id: number) => {
    try {
      await apiClient.quitarDelCarrito(producto_id);
      removeItem(producto_id);
    } catch (error) {
      console.error('Error al remover item:', error);
    }
  };

  const handleCancelarCompra = async () => {
    try {
      await apiClient.cancelarCompra();
      clearCart();
      await cargarCarrito();
    } catch (error) {
      console.error('Error al cancelar compra:', error);
    }
  };

  if (!usuario) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Cargando carrito...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Volver a comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Mi Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Productos */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.producto_id}
                className="bg-white rounded-lg shadow p-4 flex gap-4"
              >
                {item.producto?.imagen_url && (
                  <img
                    src={item.producto.imagen_url}
                    alt={item.producto.nombre}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">
                    {item.producto?.nombre}
                  </h3>
                  <p className="text-gray-600">
                    ${item.producto?.precio} x {item.cantidad}
                  </p>
                  <p className="font-bold text-blue-600">
                    ${(item.producto ? item.producto.precio * item.cantidad : 0).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.producto_id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleCancelarCompra}
              className="flex-1 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
            >
              Cancelar Compra
            </button>
            <Link
              href="/"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition"
            >
              Seguir Comprando
            </Link>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Resumen de Compra</h2>

          <div className="space-y-3 border-b pb-4 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${carrito?.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA:</span>
              <span>${carrito?.iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío:</span>
              <span>${carrito?.envio.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total:</span>
            <span>${carrito?.total.toFixed(2)}</span>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition text-center block"
          >
            Ir a Pagar
          </Link>
        </div>
      </div>
    </div>
  );
}
