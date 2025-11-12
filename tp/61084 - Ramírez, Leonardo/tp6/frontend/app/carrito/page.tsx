'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { useRouter } from 'next/navigation';
import { Producto } from '../types';

export default function CarritoPage() {
  const { token } = useAuth();
  const { items, quitarDelCarrito } = useCarrito();
  const [productos, setProductos] = useState<{ [key: number]: Producto }>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (!token) {
      router.push('/auth');
      return;
    }

    // Obtener detalles de productos en el carrito
    const loadProductos = async () => {
      try {
        const productosMap: { [key: number]: Producto } = {};
        for (const item of items) {
          const response = await fetch(`${API_URL}/productos/${item.producto_id}`);
          if (response.ok) {
            const producto = await response.json();
            productosMap[item.producto_id] = producto;
          }
        }
        setProductos(productosMap);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductos();
  }, [items, token, router, API_URL]);

  const total = items.reduce((sum: number, item: any) => {
    const producto = productos[item.producto_id];
    return sum + (producto?.precio || 0) * item.cantidad;
  }, 0);

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Carrito de compras</h1>

        {items.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
            <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Continuar comprando
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {items.map((item: any) => {
                  const producto = productos[item.producto_id];
                  if (!producto) return null;
                  return (
                    <div
                      key={item.producto_id}
                      className="flex items-center justify-between p-4 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{producto.titulo}</h3>
                        <p className="text-gray-600">${producto.precio}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-semibold">x{item.cantidad}</p>
                        <p className="text-lg font-bold">${producto.precio * item.cantidad}</p>
                        <button
                          onClick={() => quitarDelCarrito(item.producto_id)}
                          className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-xl font-bold mb-4">Resumen</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (21%):</span>
                  <span>${(total * 0.21).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${(total * 1.21).toFixed(2)}</span>
                </div>
              </div>
              <a
                href="/checkout"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded block text-center"
              >
                Ir al checkout
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
