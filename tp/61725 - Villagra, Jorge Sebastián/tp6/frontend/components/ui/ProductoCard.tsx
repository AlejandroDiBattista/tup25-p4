'use client';

import { useRouter } from 'next/navigation';
import type { Producto } from '../../app/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  producto: Producto;
  onAdd?: (producto: Producto) => Promise<void> | void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function buildImageUrl(p: Producto): string {
  const raw = (p.imagen_url ?? p.imagen ?? '').toString();
  if (!raw) return '';
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('//')) return raw;
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  const finalPath = path.startsWith('/imagenes') ? path : `/imagenes${path}`;
  return `${API_URL}${finalPath}`;
}

export default function ProductoCard({ producto, onAdd }: Props) {
  const router = useRouter();

  const nombre = (producto.nombre ?? producto.titulo ?? 'Producto').toString();
  const descripcion = (producto.descripcion ?? '').toString();
  const imagen = buildImageUrl(producto);
  const agotado = Boolean(producto.agotado ?? ((producto.existencia ?? 0) <= 0));

  async function handleAdd() {
    if (onAdd) await onAdd(producto);
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {/* Imagen: relación 1:1 para todas iguales */}
      <div
        className="relative w-full aspect-square bg-muted/60 cursor-pointer"
        onClick={() => router.push(`/producto/${producto.id}`)}
        title={nombre}
      >
        {imagen ? (
          <img
            src={imagen}
            alt={nombre}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>

      <CardHeader className="pb-2 min-h-[88px]">
        <CardTitle className="line-clamp-1 text-base">{nombre}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{descripcion}</p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">${producto.precio}</span>
          {agotado && (
            <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Agotado</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button className="w-full" disabled={agotado} onClick={handleAdd}>
          {agotado ? 'Sin stock' : 'Agregar al carrito'}
        </Button>
      </CardFooter>
    </Card>
  );
}