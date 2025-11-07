'use client';
import { useEffect, useState } from 'react';
import { listarCompras } from '@/app/services/compras';
import { useRouter } from 'next/navigation';

export default function ComprasPage() {
  const [compras, setCompras] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    listarCompras().then(setCompras).catch(() => setCompras([]));
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Mis compras</h1>
      <ul className="space-y-3">
        {compras.map((c) => (
          <li key={c.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <div className="text-sm">Compra #{c.id}</div>
              <div className="text-xs text-muted-foreground">{new Date(c.fecha).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-medium">${c.total}</div>
              <button className="px-3 py-1 border rounded text-sm" onClick={() => router.push(`/compras/${c.id}`)}>
                Ver detalle
              </button>
            </div>
          </li>
        ))}
        {compras.length === 0 && <li className="text-sm text-muted-foreground">No tenés compras aún.</li>}
      </ul>
    </main>
  );
}