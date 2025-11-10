'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '../store/auth';
import { API_URL } from '../config';

interface Compra {
  id: number;
  total: number;
  fecha: string;
  direccion: string;
}

export default function MisCompras() {
  const router = useRouter();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useAuthStore();

  useEffect(() => {
    // Verificar autenticación
    if (!token || !user) {
      router.push('/login');
      return;
    }

    // Cargar compras
    const fetchCompras = async () => {
      try {
        const response = await fetch(`${API_URL}/compras`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar las compras');
        }

        const data = await response.json();
        setCompras(data);
      } catch (err) {
        console.error('❌ Error al cargar compras:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar las compras');
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, [token, user, router]);

  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando tus compras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a la tienda
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Mis Compras</h1>
            <div className="text-sm text-gray-600">
              👤 {user?.nombre || user?.email}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        {/* Lista de compras */}
        {compras.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛍️</div>
            <h2 className="text-2xl font-bold mb-2">No tienes compras aún</h2>
            <p className="text-gray-600 mb-6">
              Comienza a explorar nuestros productos y realiza tu primera compra
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Contador */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <p className="text-blue-800">
                📦 Total de compras: <span className="font-bold">{compras.length}</span>
              </p>
            </div>

            {/* Cards de compras */}
            {compras.map((compra) => (
              <div
                key={compra.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Info principal */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Pedido #{compra.id}
                        </div>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          ✓ Completado
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">📅 Fecha:</span>
                          {formatearFecha(compra.fecha)}
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="font-semibold">📍 Envío a:</span>
                          <span className="flex-1">{compra.direccion}</span>
                        </p>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total pagado</p>
                      <p className="text-3xl font-bold text-blue-600">
                        ${compra.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer con acciones */}
                <div className="bg-gray-50 px-6 py-3 rounded-b-lg border-t">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                      🚚 Estado: <span className="font-semibold text-green-600">En camino</span>
                    </div>
                    <div className="text-blue-600 font-semibold">
                      Pedido #{compra.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Resumen total */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total invertido</p>
                  <p className="text-3xl font-bold">
                    ${compras.reduce((sum, c) => sum + c.total, 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 mb-1">Compras realizadas</p>
                  <p className="text-3xl font-bold">{compras.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}