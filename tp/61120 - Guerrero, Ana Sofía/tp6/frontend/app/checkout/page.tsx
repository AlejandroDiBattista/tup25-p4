'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { useCarritoStore } from '@/store';
import { apiClient } from '@/lib/api-client';
import { CreditCard, MapPin } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { usuario } = useAuthStore();
  const { total, clearCart } = useCarritoStore();
  const [direccion, setDireccion] = useState('');
  const [tarjeta, setTarjeta] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!usuario) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await apiClient.finalizarCompra(direccion, tarjeta);
      clearCart();
      router.push('/compras?success=true');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al finalizar compra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dirección */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex gap-2 items-center">
              <MapPin className="w-5 h-5" />
              Dirección de Entrega
            </h2>
            <textarea
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, número, apartamento, ciudad..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows={4}
              required
            />
          </div>

          {/* Pago */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex gap-2 items-center">
              <CreditCard className="w-5 h-5" />
              Método de Pago
            </h2>
            <input
              type="text"
              value={tarjeta}
              onChange={(e) => setTarjeta(e.target.value.replace(/\s/g, '').slice(0, 16))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Número de tarjeta (solo simulación, no se procesa realmente)
            </p>
          </div>

          {/* Resumen */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Resumen de Compra</h2>
            <div className="flex justify-between text-xl font-bold">
              <span>Total a Pagar:</span>
              <span className="text-pink-600">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Finalizar Compra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
