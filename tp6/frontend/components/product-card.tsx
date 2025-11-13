'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useCarritoStore } from '@/store';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  existencia: number;
  imagen_url?: string;
  es_electronico: boolean;
}

interface ProductCardProps {
  producto: Producto;
}

export function ProductCard({ producto }: ProductCardProps) {
  const router = useRouter();
  const { usuario } = useAuthStore();
  const { addItem } = useCarritoStore();
  const [loading, setLoading] = useState(false);

  const handleAgregarAlCarrito = async () => {
    if (!usuario) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      await apiClient.agregarAlCarrito(producto.id, 1);
      addItem({
        producto_id: producto.id,
        cantidad: 1,
        producto: {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen_url: producto.imagen_url,
        },
      });
      // Toast o notificación de éxito
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const agotado = producto.existencia === 0;

  return (
    <Card className="flex flex-col h-full">
      {/* Imagen */}
      <div className="bg-gray-200 h-48 flex items-center justify-center">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400">Sin imagen</div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-lg">{producto.nombre}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{producto.categoria}</p>
          </div>
          {producto.es_electronico && (
            <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
              Electrónico
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-grow">
        <p className="text-gray-600 text-sm">{producto.descripcion}</p>
        {agotado ? (
          <p className="text-red-600 font-semibold mt-3">Agotado</p>
        ) : (
          <p className="text-green-600 text-sm mt-3">
            {producto.existencia} disponibles
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-3 border-t">
        <span className="text-2xl font-bold text-pink-600">
          ${producto.precio.toFixed(2)}
        </span>
        <Button
          onClick={handleAgregarAlCarrito}
          disabled={agotado || loading}
          size="sm"
        >
          {loading ? 'Agregando...' : <ShoppingCart className="w-4 h-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
