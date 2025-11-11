'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, Calendar, DollarSign } from 'lucide-react';

interface CompraItem {
  id: number;
  producto_id: number;
  producto_titulo: string;
  producto_imagen: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface Compra {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  items: CompraItem[];
}

export default function PurchasesPage() {
  const router = useRouter();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCompras();
  }, []);

  const cargarCompras = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/compras', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar compras');
      }

      const data = await response.json();
      setCompras(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Cargando compras...</p>
      </div>
    );
  }

  if (compras.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Card className="p-12 text-center">
          <Package className="h-24 w-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No tienes compras aún
          </h2>
          <p className="text-gray-600 mb-6">
            Explora nuestros productos y realiza tu primera compra
          </p>
          <Button onClick={() => router.push('/products')}>
            Ir a Productos
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mis Compras
        </h1>
        <p className="text-gray-600">
          Historial de todas tus compras realizadas
        </p>
      </div>

      <div className="space-y-4">
        {compras.map((compra) => (
          <Card
            key={compra.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/purchases/${compra.id}`)}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Información principal */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pedido #{compra.id}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    compra.estado === 'completada' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {compra.estado}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatearFecha(compra.fecha)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {compra.items.reduce((sum, item) => sum + item.cantidad, 0)} productos
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${compra.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview de productos */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex gap-2 overflow-x-auto">
                {compra.items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 text-sm text-gray-600"
                  >
                    {item.producto_titulo} (x{item.cantidad})
                  </div>
                ))}
                {compra.items.length > 3 && (
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    +{compra.items.length - 3} más
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
