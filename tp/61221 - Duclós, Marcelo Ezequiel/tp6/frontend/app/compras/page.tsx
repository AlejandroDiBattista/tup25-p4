'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Compra } from '../types';

interface CompraDetallada extends Compra {
  items?: {
    producto_id: number;
    cantidad: number;
    nombre: string;
    precio_unitario: number;
    categoria: string;
  }[];
}

export default function ComprasPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  
  const [compras, setCompras] = useState<CompraDetallada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compraSeleccionada, setCompraSeleccionada] = useState<CompraDetallada | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCompras();
  }, [isAuthenticated, token, router]);

  const fetchCompras = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:8000/compras', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCompras(data.compras || []);
      } else {
        setError('Error al cargar las compras');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetalleCompra = async (compraId: number) => {
    if (!token) return;
    
    try {
      const response = await fetch(`http://localhost:8000/compra/${compraId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const compraDetalle = await response.json();
        setCompraSeleccionada(compraDetalle);
      } else {
        setError('Error al cargar el detalle de la compra');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus compras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">¡Compra realizada exitosamente!</h3>
                <p className="mt-1 text-sm text-green-700">Tu pedido ha sido procesado correctamente.</p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis compras</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de compras */}
          <div>
            {compras.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No tienes compras aún
                </h3>
                <p className="text-gray-600 mb-6">
                  Cuando realices tu primera compra, aparecerá aquí.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ir a comprar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {compras.map((compra) => (
                  <div
                    key={compra.id}
                    className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all ${
                      compraSeleccionada?.id === compra.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                    }`}
                    onClick={() => fetchDetalleCompra(compra.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          Compra #{compra.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(compra.fecha).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          ${compra.total}
                        </p>
                        {compra.total_items && (
                          <p className="text-sm text-gray-500">
                            {compra.total_items} producto{compra.total_items !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Dirección:</span> {compra.direccion}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Tarjeta:</span> {compra.tarjeta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detalle de la compra */}
          <div>
            {compraSeleccionada ? (
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Detalle de la compra
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-medium">Compra #:</span>
                    <span>{compraSeleccionada.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Fecha:</span>
                    <span>
                      {new Date(compraSeleccionada.fecha).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Dirección:</span>
                    <span className="text-right">{compraSeleccionada.direccion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tarjeta:</span>
                    <span>{compraSeleccionada.tarjeta}</span>
                  </div>
                </div>

                {compraSeleccionada.items && compraSeleccionada.items.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Productos</h3>
                    <div className="space-y-3">
                      {compraSeleccionada.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-medium">{item.nombre}</p>
                            <p className="text-sm text-gray-500">
                              Cantidad: {item.cantidad}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${(item.precio_unitario * item.cantidad).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              IVA: {item.categoria.toLowerCase().includes('electrón') ? '21%' : '10.5%'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${compraSeleccionada.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA:</span>
                    <span>${compraSeleccionada.iva}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span>${compraSeleccionada.envio}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total pagado:</span>
                    <span>${compraSeleccionada.total}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600">
                  Selecciona una compra para ver los detalles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}