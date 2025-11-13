'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { apiClient } from '@/lib/api-client';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface Compra {
  id: number;
  fecha: string;
  total: number;
  items: any[];
}

export default function ComprasPage() {
  const router = useRouter();
  const { usuario } = useAuthStore();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [selected, setSelected] = useState<Compra | null>(null);

  useEffect(() => {
    if (!usuario) {
      router.push('/login');
      return;
    }
    cargarCompras();

    // Mostrar mensaje de éxito si viene del checkout
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }
  }, [usuario, router]);

  const cargarCompras = async () => {
    try {
      setLoading(true);
      const response = await apiClient.obtenerCompras();
      setCompras(response.data);
      // seleccionar la primera compra por defecto
      if (response.data && response.data.length > 0) {
        setSelected(response.data[0]);
      }
    } catch (error) {
      console.error('Error al cargar compras:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Mis compras</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-semibold">
            ✓ ¡Compra finalizada exitosamente!
          </p>
        </div>
      )}

      {loading ? (
        <p className="text-center">Cargando compras...</p>
      ) : compras.length === 0 ? (
          <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-4">No hay compras</h2>
          <p className="text-gray-600 mb-6">Aún no has realizado ninguna compra</p>
          <Link
            href="/"
              className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            Volver a Comprar
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lista a la izquierda */}
          <div className="md:col-span-1 sticky top-24 self-start">
            <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
              {compras.map((compra) => {
                const isSelected = selected?.id === compra.id;
                return (
                  <button
                    key={compra.id}
                    onClick={() => setSelected(compra)}
                    className={`w-full text-left p-4 rounded-lg border transition hover:shadow-lg flex flex-col gap-2 ${
                      isSelected
                ? 'bg-pink-50 border-pink-200 ring-1 ring-pink-100 shadow-md border-l-4 border-pink-600'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-sm">Compra #{compra.id}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(compra.fecha).toLocaleString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-sm font-semibold text-pink-600">${compra.total.toFixed(2)}</span>
                        <span className="mt-1 text-xs text-gray-400">{compra.items?.length || 0} productos</span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Detalles</span>
                      <span className="inline-block text-xs bg-pink-600 text-white px-2 py-0.5 rounded-full">Completada</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detalle a la derecha */}
          <div className="md:col-span-2">
            {selected ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-pink-600">Detalle de la compra</h2>
                    <p className="text-sm text-gray-600">Compra #: {selected.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Fecha:</p>
                    <p className="text-gray-600">{new Date(selected.fecha).toLocaleString('es-AR')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-2">Productos</h3>
                    <div className="space-y-4">
                      {selected.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center border-b pb-3">
                          <div>
                            <p className="font-medium">{item.nombre}</p>
                            <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-pink-600">${(item.precio_unitario * item.cantidad).toFixed(2)}</p>
                            <p className="text-xs text-gray-400">IVA: ${(item.precio_unitario * item.cantidad * 0.21).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Subtotal:</span>
                          <span className="font-medium">${(selected.total * 0.7).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">IVA:</span>
                          <span className="font-medium">${(selected.total * 0.21).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Envío:</span>
                          <span className="font-medium">$50.00</span>
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total pagado:</span>
                          <span className="text-pink-600">${selected.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">Seleccione una compra para ver sus detalles</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
