'use client';
import { useEffect, useState } from 'react';
import { compraPorId } from '@/app/services/compras';
import { useParams, useRouter } from 'next/navigation';

export default function CompraDetallePage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [compra, setCompra] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    compraPorId(id).then(setCompra).catch(() => setCompra(null));
  }, [id]);

  if (!compra) return <main className="container mx-auto p-4">Cargando...</main>;

  return (
    <main className="container mx-auto p-4">
      <button className="mb-4 text-sm underline" onClick={() => router.push('/compras')}>Volver</button>
      <h1 className="text-xl font-semibold mb-2">Compra #{compra.id}</h1>
      <div className="text-sm text-muted-foreground mb-4">{new Date(compra.fecha).toLocaleString()}</div>
      <div className="grid gap-2">
        {compra.items?.map((it: any, idx: number) => (
          <div key={idx} className="flex justify-between border-b py-2 text-sm">
            <div>{it.nombre} x{it.cantidad}</div>
            <div>${(it.precio_unitario * it.cantidad).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm">
        <div>Envío: ${compra.envio}</div>
        <div className="font-semibold text-base">Total: ${compra.total}</div>
      </div>
    </main>
  );
}