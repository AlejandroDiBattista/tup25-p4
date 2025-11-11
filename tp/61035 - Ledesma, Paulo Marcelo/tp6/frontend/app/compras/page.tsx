'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ItemCompra {
  id: number;
  producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface Compra {
  id: number;
  fecha: string;
  items: ItemCompra[];
  total: number;
  direccion: string;
  estado: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ComprasPage() {
  const router = useRouter();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [compraSeleccionada, setCompraSeleccionada] = useState<Compra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('tp6_token') : null;

  useEffect(() => {
    const fetchCompras = async () => {
      if (!token) {
        setError('Debes iniciar sesión');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/compras`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Error al obtener compras');

        const data = await res.json();
        setCompras(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar compras');
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, [token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-100 to-slate-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cargando compras...</p>
        </div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-100 to-slate-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Debes iniciar sesión</h1>
          <Button onClick={() => router.push('/login')}>Ir a login</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-100 to-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-sky-700">Mis Compras</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600">
            {error}
          </div>
        )}

        {compras.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-sky-200">
            <p className="text-gray-600 mb-4">No tienes compras realizadas aún</p>
            <Button onClick={() => router.push('/')}>Ir al catálogo</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de compras */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-4 border border-sky-200 max-h-96 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4 text-sky-700">Historial</h2>
                <div className="space-y-2">
                  {compras.map((compra) => (
                    <button
                      key={compra.id}
                      onClick={() => setCompraSeleccionada(compra)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        compraSeleccionada?.id === compra.id
                          ? 'bg-sky-100 border-l-4 border-sky-600'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-semibold text-sm">Compra #{compra.id}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(compra.fecha).toLocaleDateString('es-AR')}
                      </div>
                      <div className="text-sm font-semibold text-sky-700">
                        ${compra.total.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Detalle de compra */}
            <div className="lg:col-span-2">
              {compraSeleccionada ? (
                <div className="bg-white rounded-lg shadow-lg p-6 border border-sky-200">
                  <h2 className="text-xl font-semibold mb-4 text-sky-700">
                    Compra #{compraSeleccionada.id}
                  </h2>

                  {/* Información general */}
                  <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b border-sky-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Fecha</p>
                      <p className="font-semibold">
                        {new Date(compraSeleccionada.fecha).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Estado</p>
                      <p className="font-semibold capitalize">{compraSeleccionada.estado}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 uppercase">Dirección</p>
                      <p className="font-semibold">{compraSeleccionada.direccion}</p>
                    </div>
                  </div>

                  {/* Items de la compra */}
                  <h3 className="text-lg font-semibold mb-3 text-sky-700">Productos</h3>
                  <div className="space-y-2 mb-6 pb-4 border-b border-sky-100">
                    {compraSeleccionada.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          <strong>{item.producto}</strong>
                          <span className="text-gray-600"> x {item.cantidad}</span>
                        </span>
                        <span className="font-semibold">${item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-sky-700">
                      Total: ${compraSeleccionada.total.toFixed(2)}
                    </p>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={() => router.push('/')}
                      variant="outline"
                    >
                      Seguir comprando
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-sky-200">
                  <p className="text-gray-600">Selecciona una compra para ver los detalles</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
