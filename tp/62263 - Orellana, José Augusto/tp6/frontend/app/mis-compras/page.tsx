import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { obtenerCompras } from '../services/compras';
import { formatCurrency, formatDateTime } from '../lib/format';

interface PageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function MisComprasPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/login');
  }

  const compras = await obtenerCompras(token.value);

  if (!compras.length) {
    return (
      <section className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Mis compras</h1>
          <p className="text-sm text-slate-500">Todavía no realizaste compras. Explora nuestros productos y realiza tu primer pedido.</p>
        </header>

        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          <p>No encontramos compras registradas.</p>
          <Link href="/" className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-900/90">
            Ver productos
          </Link>
        </div>
      </section>
    );
  }

  const compraParam = searchParams?.compra;
  const compraId = Array.isArray(compraParam) ? parseInt(compraParam[0] ?? '', 10) : parseInt(compraParam ?? '', 10);
  const compraSeleccionada = compras.find((compra) => compra.id === compraId) ?? compras[0];

  const subtotal = Math.max(compraSeleccionada.total - compraSeleccionada.iva - compraSeleccionada.envio, 0);
  const tasaIva = subtotal > 0 ? compraSeleccionada.iva / subtotal : 0;

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Mis compras</h1>
        <p className="text-sm text-slate-500">Consulta el historial de tus pedidos y revisa los detalles de cada compra.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-3">
          {compras.map((compra) => {
            const activa = compra.id === compraSeleccionada.id;

            return (
              <Link
                key={compra.id}
                href={`/mis-compras?compra=${compra.id}`}
                aria-current={activa ? 'page' : undefined}
                className={`block rounded-xl border p-4 shadow-sm transition ${
                  activa
                    ? 'border-slate-900 bg-white'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow'
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">Compra #{compra.id}</p>
                <p className="text-xs text-slate-500">{formatDateTime(compra.fecha)}</p>
                <p className="mt-2 text-sm font-medium text-slate-700">Total: {formatCurrency(compra.total)}</p>
              </Link>
            );
          })}
        </aside>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Detalle de la compra</h2>
              <p className="text-sm text-slate-500">Compra #{compraSeleccionada.id}</p>
            </div>
            <div className="text-xs text-slate-500">
              <p>{formatDateTime(compraSeleccionada.fecha)}</p>
              <p>Tarjeta: {compraSeleccionada.tarjeta}</p>
            </div>
          </div>

          <div className="grid gap-1 text-sm text-slate-600">
            <p><span className="font-medium text-slate-900">Dirección:</span> {compraSeleccionada.direccion}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Productos</h3>
            <div className="space-y-4">
              {compraSeleccionada.items.map((item) => {
                const itemTotal = item.precio_unitario * item.cantidad;
                const itemIva = tasaIva > 0 ? itemTotal * tasaIva : 0;

                return (
                  <article key={item.id} className="space-y-1 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.nombre}</p>
                        <p className="text-xs text-slate-500">Cantidad: {item.cantidad}</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{formatCurrency(itemTotal)}</span>
                    </div>
                    {tasaIva > 0 ? (
                      <p className="text-xs text-slate-400">IVA: {formatCurrency(itemIva)}</p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA</span>
              <span>{formatCurrency(compraSeleccionada.iva)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>{formatCurrency(compraSeleccionada.envio)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-slate-900">
              <span>Total pagado</span>
              <span>{formatCurrency(compraSeleccionada.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
