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
      <h1 className="text-3xl font-bold mb-8">Mis Compras</h1>

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
          <p className="text-gray-600 mb-6">
            Aún no has realizado ninguna compra
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Volver a Comprar
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {compras.map((compra) => (
            <div
              key={compra.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Compra #{compra.id}</h3>
                  <p className="text-gray-600">
                    Fecha: {new Date(compra.fecha).toLocaleDateString('es-AR')}
                  </p>
                  <p className="text-gray-600">
                    {compra.items?.length || 0} productos
                  </p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      ${compra.total.toFixed(2)}
                    </p>
                  </div>
                  <Link
                    href={`/compras/${compra.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
