'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { estaAutenticado, getAuthHeaders } from '../services/auth';

interface ItemCompra {
  producto_id: number;
  titulo: string;
  cantidad: number;
  precio_unitario: number;
}

interface Compra {
  id: number;
  fecha: string;
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
  items: ItemCompra[];
}

export default function ComprasPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [compraDetalle, setCompraDetalle] = useState<number | null>(null);

  const cargarCompras = async () => {
    try {
      const response = await fetch(`${API_URL}/compras/historial`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Error al cargar compras');
      
      const data = await response.json();
      setCompras(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!estaAutenticado()) {
      router.push('/auth');
      return;
    }
    cargarCompras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDetalle = (compraId: number) => {
    setCompraDetalle(compraDetalle === compraId ? null : compraId);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
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
        <p className="text-gray-600">Cargando historial...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Mis Compras</h1>
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Volver al catálogo
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {compras.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-xl mb-4">No tienes compras aún</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Comenzar a comprar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">
              Total de compras: {compras.length}
            </p>

            {compras.map((compra) => (
              <div key={compra.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header de la compra */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleDetalle(compra.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Compra #{compra.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatearFecha(compra.fecha)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {compra.items.length} producto{compra.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        ${compra.total.toFixed(2)}
                      </p>
                      <button className="text-sm text-blue-600 hover:text-blue-700 mt-2">
                        {compraDetalle === compra.id ? 'Ocultar detalles ▲' : 'Ver detalles ▼'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detalle expandible */}
                {compraDetalle === compra.id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {/* Lista de productos */}
                    <h4 className="font-semibold text-gray-900 mb-4">Productos:</h4>
                    <div className="space-y-3 mb-6">
                      {compra.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-3 rounded">
                          <div>
                            <p className="font-medium text-gray-900">{item.titulo}</p>
                            <p className="text-sm text-gray-600">
                              Cantidad: {item.cantidad} × ${item.precio_unitario}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ${(item.cantidad * item.precio_unitario).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Resumen de totales */}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal:</span>
                        <span>${compra.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>IVA (21%):</span>
                        <span>${compra.iva.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Envío:</span>
                        <span>{compra.envio === 0 ? 'GRATIS' : `$${compra.envio.toFixed(2)}`}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-blue-600">${compra.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
