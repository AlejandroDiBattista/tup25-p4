'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { obtenerHistorialCompras, type CompraResumen } from '../services/compras';

export default function ComprasPage() {
  const { estaAutenticado, cargando, token } = useAuth();
  const router = useRouter();
  const [compras, setCompras] = useState<CompraResumen[]>([]);
  const [totalCompras, setTotalCompras] = useState(0);
  const [cargandoCompras, setCargandoCompras] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!cargando && !estaAutenticado) {
      router.push('/auth/login');
    }
  }, [estaAutenticado, cargando, router]);

  useEffect(() => {
    if (estaAutenticado && token) {
      cargarHistorial();
    }
  }, [estaAutenticado, token]);

  const cargarHistorial = async () => {
    if (!token) return;

    setCargandoCompras(true);
    try {
      const data = await obtenerHistorialCompras(token);
      setCompras(data.compras);
      setTotalCompras(data.total_compras || data.compras.length);
      setMensaje(data.mensaje || '');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar historial');
    } finally {
      setCargandoCompras(false);
    }
  };

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!estaAutenticado) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Compras</h1>
        <p className="text-gray-600 mt-2">
          {totalCompras > 0 
            ? `Tienes ${totalCompras} ${totalCompras === 1 ? 'compra realizada' : 'compras realizadas'}`
            : 'Historial de tus compras'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Contenido */}
      {cargandoCompras ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando historial...</p>
        </div>
      ) : compras.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {mensaje || 'No tienes compras realizadas'}
          </h3>
          <p className="text-gray-600 mb-6">
            Cuando realices una compra, aparecerá aquí tu historial
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ver productos
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {compras.map((compra) => (
            <div
              key={compra.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
              onClick={() => router.push(`/compras/${compra.id}`)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Compra #{compra.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatearFecha(compra.fecha)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">
                      ${compra.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {compra.envio === 0 ? 'Envío gratis' : `Envío: $${compra.envio.toFixed(2)}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Dirección de envío</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {compra.direccion}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Productos</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {compra.cantidad_productos} {compra.cantidad_productos === 1 ? 'artículo' : 'artículos'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <span className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    Ver detalles
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
