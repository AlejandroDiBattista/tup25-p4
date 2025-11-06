'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Producto } from '@/app/types'; // si falla el alias, probá: import type { Producto } from '../../app/types';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = {
  producto: Producto;
  onAdd?: (producto: Producto) => Promise<void> | void;
};

export default function ProductoCard({ producto, onAdd }: Props) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const agotado = (producto.existencia ?? 0) <= 0;
  const precioFmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(producto.precio);

  const imgSrc = (() => {
    const img = producto.imagen?.trim();
    if (!img) return undefined;
    if (img.startsWith('http')) return img;
    const path = img.replace(/^\/?imagenes\//, '');
    return `${API_URL}/imagenes/${path}`;
  })();

  async function addToCart() {
    setErr(null);
    setAdding(true);
    try {
      if (onAdd) {
        await onAdd(producto);
        return;
      }
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const res = await fetch(`${API_URL}/carrito`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ producto_id: producto.id, cantidad: 1 }),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch {
      setErr('No se pudo agregar al carrito.');
    } finally {
      setAdding(false);
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-2">
        <CardTitle className="line-clamp-1">{producto.titulo}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{precioFmt}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${agotado ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {agotado ? 'Agotado' : `Stock: ${producto.existencia}`}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={producto.titulo}
            className="w-full h-48 object-cover rounded-md border"
          />
        ) : (
          <div className="w-full h-48 rounded-md border grid place-items-center text-sm text-muted-foreground">
            Sin imagen
          </div>
        )}

        {producto.descripcion && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{producto.descripcion}</p>
        )}

        {typeof producto.valoracion === 'number' && (
          <div className="mt-2 text-amber-500 text-sm" title={`Valoración: ${producto.valoracion}/5`}>
            {'★'.repeat(Math.round(producto.valoracion))}{' '}
            <span className="text-muted-foreground">({producto.valoracion.toFixed(1)})</span>
          </div>
        )}

        {producto.categoria && (
          <p className="mt-2 text-xs text-muted-foreground">Categoría: {producto.categoria}</p>
        )}

        {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={addToCart} disabled={agotado || adding}>
          {agotado ? 'No disponible' : adding ? 'Agregando...' : 'Agregar al carrito'}
        </Button>
      </CardFooter>
    </Card>
  );
}