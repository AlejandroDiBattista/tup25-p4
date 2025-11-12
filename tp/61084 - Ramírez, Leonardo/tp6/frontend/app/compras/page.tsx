'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface Compra {
  id: number;
  usuario: string;
  items: any[];
  total: number;
  direccion: string;
  fecha: string;
}

export default function ComprasPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (!token) {
      router.push('/auth');
      return;
    }

    const loadCompras = async () => {
      try {
        const response = await fetch(`${API_URL}/compras`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar compras');
        }

        const data = await response.json();
        setCompras(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar compras');
      } finally {
        setIsLoading(false);
      }
    };

    loadCompras();
  }, [token, router, API_URL]);

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mis compras</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">Cargando compras...</div>
        ) : compras.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">No tienes compras realizadas</p>
            <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Ir al catálogo
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {compras.map((compra) => (
              <div
                key={compra.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Número de compra</p>
                    <p className="text-lg font-semibold">#{compra.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="text-lg font-semibold">
                      {new Date(compra.fecha).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Artículos</p>
                    <p className="text-lg font-semibold">{compra.items.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-semibold">${compra.total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Envío a:</p>
                  <p className="text-gray-800">{compra.direccion}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => router.push(`/compras/${compra.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
