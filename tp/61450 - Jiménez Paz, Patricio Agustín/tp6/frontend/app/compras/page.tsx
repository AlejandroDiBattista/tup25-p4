'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerHistorialCompras } from '../services/compras';
import { CompraResumen } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import { toast } from 'sonner';

export default function ComprasPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [compras, setCompras] = useState<CompraResumen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    cargarCompras();
  }, [isAuthenticated]);

  const cargarCompras = async () => {
    try {
      setLoading(true);
      const data = await obtenerHistorialCompras();
      setCompras(data);
    } catch (err: any) {
      toast.error(err.message || 'Error al cargar el historial de compras');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando compras...</p>
      </div>
    );
  }

  if (compras.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sin Compras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Aún no has realizado ninguna compra</p>
              <Link href="/">
                <Button className="w-full">Ir a Comprar</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Compras</h1>

        <div className="space-y-4">
          {compras.map((compra) => (
            <Card key={compra.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">
                      Compra #{compra.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatearFecha(compra.fecha)}
                    </p>
                  </div>
                  <Badge 
                    variant={compra.estado === 'completada' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {compra.estado}
                  </Badge>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${compra.total.toFixed(2)}
                    </p>
                  </div>
                  <Link href={`/compras/${compra.id}`}>
                    <Button variant="outline">
                      Ver Detalle
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Link href="/">
            <Button variant="outline" className="w-full">
              Volver a la Tienda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
