'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { obtenerDetalleCompra } from '../../services/compras';
import { Compra } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DetalleCompraPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const compra_id = parseInt(params.id as string);
  const [compra, setCompra] = useState<Compra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    cargarCompra();
  }, [isAuthenticated, compra_id]);

  const cargarCompra = async () => {
    try {
      setLoading(true);
      const data = await obtenerDetalleCompra(compra_id);
      setCompra(data);
    } catch (err: any) {
      const errorMsg = err.message || 'Error al cargar el detalle de la compra';
      setError(errorMsg);
      toast.error(errorMsg);
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
        <p className="text-xl text-gray-600">Cargando detalle...</p>
      </div>
    );
  }

  if (error || !compra) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error || 'Compra no encontrada'}</p>
            <Link href="/compras">
              <Button className="w-full">Volver a Mis Compras</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/compras">
            <Button variant="outline" size="sm">
              ← Volver a Mis Compras
            </Button>
          </Link>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 flex items-center gap-4">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">¡Compra Exitosa!</h2>
            <p className="text-gray-600">Tu pedido ha sido procesado correctamente</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Número de Orden</p>
                <p className="font-semibold">#{compra.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha</p>
                <p className="font-semibold">{formatearFecha(compra.fecha)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <Badge 
                  variant={compra.estado === 'completada' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {compra.estado}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Dirección</p>
                <p className="font-semibold">{compra.direccion}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {compra.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">Producto ID: {item.producto_id}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                    <p className="text-sm text-gray-600">
                      Precio unitario: ${item.precio_unitario.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-lg font-bold">${item.subtotal.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${compra.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Link href="/">
            <Button className="w-full">
              Seguir Comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
