'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useParams } from 'next/navigation';

interface CarritoItem {
  producto_id: number;
  cantidad: number;
}

interface Compra {
  id: number;
  usuario: string;
  items: CarritoItem[];
  total: number;
  direccion: string;
  fecha: string;
}

export default function DetalleCompraBPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const compraId = params?.id;

  const [compra, setCompra] = useState<Compra | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (!token) {
      router.push('/auth');
      return;
    }

    const loadCompra = async () => {
      try {
        const response = await fetch(`${API_URL}/compras/${compraId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Compra no encontrada');
        }

        const data = await response.json();
        setCompra(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar la compra');
      } finally {
        setIsLoading(false);
      }
    };

    if (compraId) {
      loadCompra();
    }
  }, [token, compraId, router, API_URL]);

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline mb-4"
        >
          ← Volver
        </button>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">Cargando detalle...</div>
        ) : compra ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">Compra #{compra.id}</h1>

            <div className="space-y-4 mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-gray-600">Fecha de compra</p>
                <p className="text-lg font-semibold">
                  {new Date(compra.fecha).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Dirección de envío</p>
                <p className="text-lg font-semibold">{compra.direccion}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Artículos comprados</h2>
              <div className="space-y-2">
                {compra.items.map((item: CarritoItem) => (
                  <div key={item.producto_id} className="flex justify-between items-center">
                    <span>Producto ID: {item.producto_id}</span>
                    <span className="font-semibold">Cantidad: {item.cantidad}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Monto total</h3>
              <p className="text-2xl font-bold text-green-600">${compra.total.toFixed(2)}</p>
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
            >
              Continuar comprando
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
