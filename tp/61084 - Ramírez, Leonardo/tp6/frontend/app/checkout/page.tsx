'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CheckoutPage() {
  const { token } = useAuth();
  const { items, vaciarCarrito } = useCarrito();
  const router = useRouter();
  const [direccion, setDireccion] = useState('');
  const [tarjeta, setTarjeta] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (!token) {
      router.push('/auth');
    }
    if (items.length === 0) {
      router.push('/carrito');
    }
  }, [token, items, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/carrito/finalizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ direccion, tarjeta }),
      });

      if (!response.ok) {
        throw new Error('Error al finalizar compra');
      }

      const data = await response.json();
      vaciarCarrito();
      router.push(`/compras/${data.compra_id}`);
    } catch (err: any) {
      setError(err.message || 'Error en el proceso de compra');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Finalizar compra</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección de envío</label>
              <textarea
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Calle, número, apartamento, ciudad..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de tarjeta</label>
              <input
                type="text"
                value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value.replace(/\s/g, ''))}
                required
                maxLength={16}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1234 5678 9012 3456"
              />
              <p className="text-xs text-gray-500 mt-1">Se aceptan tarjetas de prueba como 4111111111111111</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Resumen del pedido:</h3>
              <p className="text-gray-600 mb-4">Artículos: {items.length}</p>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
              >
                {isLoading ? 'Procesando...' : 'Confirmar compra'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
