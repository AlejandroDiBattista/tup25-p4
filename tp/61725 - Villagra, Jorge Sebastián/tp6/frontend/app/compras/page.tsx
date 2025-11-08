'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { comprasUsuario, compraPorId } from '@/app/services/compras';

type CompraResumen = { id: number; fecha_iso: string; total: number; items_cantidad: number; estado: string; metodo_pago?: string };

export default function ComprasPage() {
  const router = useRouter();
  const [lista, setLista] = useState<CompraResumen[]>([]);
  const [sel, setSel] = useState<any | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDet, setLoadingDet] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cargarLista() {
    setLoadingList(true);
    setError(null);
    try {
      const data = await comprasUsuario();
      setLista(data);
      if (data.length) cargarDetalle(data[0].id);
    } catch (e: any) {
      if (e.status === 401) return router.replace('/auth/login');
      setError(e.message);
    } finally {
      setLoadingList(false);
    }
  }

  async function cargarDetalle(id: number) {
    setLoadingDet(true);
    try {
      const det = await compraPorId(id);
      setSel(det);
    } catch (e: any) {
      if (e.status === 401) return router.replace('/auth/login');
      setSel(null);
    } finally {
      setLoadingDet(false);
    }
  }

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!t) {
      router.replace('/auth/login');
      return;
    }
    cargarLista();
  }, [router]);

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="text-2xl font-semibold mb-6">Mis compras</h1>
      {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-3">
          {loadingList && <div className="h-24 rounded border bg-neutral-100 animate-pulse" />}
          {!loadingList && lista.length === 0 && <div className="text-sm text-neutral-500 border rounded p-4">Aún no realizaste compras.</div>}
          {lista.map(c => {
            const active = sel?.id === c.id;
            return (
              <button key={c.id} onClick={() => cargarDetalle(c.id)}
                className={`w-full text-left border rounded px-4 py-3 transition ${active ? 'bg-neutral-50 shadow-sm border-neutral-400' : 'hover:bg-neutral-50'}`}>
                <div className="text-xs text-neutral-500">{new Date(c.fecha_iso).toLocaleString('es-AR')}</div>
                <div className="font-medium mt-1">Compra #{c.id}</div>
                <div className="flex justify-between mt-1 text-sm">
                  <span>{c.items_cantidad} ítems</span>
                  <span className="font-semibold">{c.total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</span>
                </div>
                <div className="text-xs mt-1 uppercase tracking-wide text-neutral-500">{c.estado}</div>
              </button>
            );
          })}
        </div>
        <div className="border rounded-lg bg-white shadow-sm p-6 flex flex-col">
          {loadingDet && <div className="space-y-3 animate-pulse">
            <div className="h-6 bg-neutral-200 rounded" />
            <div className="h-4 bg-neutral-200 rounded w-1/2" />
            <div className="h-32 bg-neutral-200 rounded" />
          </div>}
          {!loadingDet && sel && (
            <>
              <h2 className="text-lg font-semibold mb-2">Detalle de la compra</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <div className="font-medium">Compra #:</div><div>{sel.id}</div>
                  <div className="font-medium mt-2">Dirección:</div><div>{sel.direccion || '—'}</div>
                  <div className="font-medium mt-2">Teléfono:</div><div>{sel.telefono || '—'}</div>
                </div>
                <div>
                  <div className="font-medium">Fecha:</div><div>{new Date(sel.fecha_iso).toLocaleString('es-AR')}</div>
                  <div className="font-medium mt-2">Estado:</div><div className="uppercase text-xs tracking-wide">{sel.estado}</div>
                </div>
              </div>
              <h3 className="font-medium mt-2 mb-2">Productos</h3>
              <ul className="divide-y mb-4">
                {sel.items?.map((it: any) => (
                  <li key={it.id} className="py-3 flex justify-between text-sm">
                    <div>
                      <div className="font-medium">{it.titulo}</div>
                      <div className="text-xs text-neutral-500">Cantidad: {it.cantidad}</div>
                    </div>
                    <div className="text-right">
                      <div>{it.subtotal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</div>
                      <div className="text-[11px] text-neutral-500">
                        IVA: {(it.subtotal * 0.21).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-4 border-t text-sm space-y-1">
                <div className="flex justify-between"><span>Subtotal:</span><span>{(sel.total / 1.21).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</span></div>
                <div className="flex justify-between"><span>IVA (21%):</span><span>{(sel.total - sel.total / 1.21).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</span></div>
                <div className="flex justify-between font-semibold text-base pt-1">
                  <span>Total pagado:</span><span>{sel.total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</span>
                </div>
              </div>
            </>
          )}
          {!loadingDet && !sel && <div className="text-sm text-neutral-500">Selecciona una compra para ver el detalle.</div>}
        </div>
      </div>
    </main>
  );
}