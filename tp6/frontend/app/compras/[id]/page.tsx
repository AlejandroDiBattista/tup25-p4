'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Compra {
  id: number;
  fecha: string;
  direccion: string;
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
  items: any[];
}

export default function CompraDetallesPage() {
  const params = useParams();
  const router = useRouter();
  const { usuario } = useAuthStore();
  const [compra, setCompra] = useState<Compra | null>(null);
  const [loading, setLoading] = useState(true);
  const compraId = params.id as string;

  useEffect(() => {
    if (!usuario) {
      router.push('/login');
      return;
    }
    cargarCompra();
  }, [usuario, router, compraId]);

  const cargarCompra = async () => {
    try {
      setLoading(true);
      const response = await apiClient.obtenerCompra(parseInt(compraId));
      setCompra(response.data);
    } catch (error) {
      console.error('Error al cargar compra:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Cargando detalles...</p>
      </div>
    );
  }

  if (!compra) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 mb-4">Compra no encontrada</p>
        <Link
          href="/compras"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a mis compras
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/compras"
        className="text-blue-600 hover:underline flex items-center gap-2 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a mis compras
      </Link>

      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Detalles de Compra #{compra.id}</h1>

        {/* Información general */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600">Fecha de Compra</p>
              <p className="font-semibold text-lg">
                {new Date(compra.fecha).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Dirección de Entrega</p>
              <p className="font-semibold">{compra.direccion}</p>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Productos</h2>
          <div className="space-y-4">
            {compra.items?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border-b last:border-b-0"
              >
                <div>
                  <p className="font-semibold">{item.nombre}</p>
                  <p className="text-gray-600">
                    ${item.precio_unitario} x {item.cantidad}
                  </p>
                </div>
                <p className="font-bold">
                  ${(item.precio_unitario * item.cantidad).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen financiero */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Resumen de Pago</h2>
          <div className="space-y-3 mb-4 pb-4 border-b">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${compra.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA:</span>
              <span>${compra.iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío:</span>
              <span>${compra.envio.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Total Pagado:</span>
            <span className="text-green-600">${compra.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
