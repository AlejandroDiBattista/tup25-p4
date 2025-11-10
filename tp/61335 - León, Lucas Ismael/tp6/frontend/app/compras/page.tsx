"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listarCompras } from '../services/orden';

type Compra = { id: number; fecha: string; total: number };

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await listarCompras();
        setCompras(res);
      } catch {
          alert('Iniciá sesión para ver tus compras');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Mis compras</h1>
      {compras.length === 0 && <p>No tenés compras todavía.</p>}
      <ul className="space-y-2">
        {compras.map((c) => (
          <li key={c.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">{new Date(c.fecha).toLocaleString()}</div>
              <div className="font-semibold">Total: ${c.total.toFixed(2)}</div>
            </div>
            <Link href={`/compras/${c.id}`} className="text-blue-600 hover:underline">Ver detalle</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
