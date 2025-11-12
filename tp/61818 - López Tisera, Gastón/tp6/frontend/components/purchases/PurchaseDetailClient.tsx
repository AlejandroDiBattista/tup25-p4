"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { fetchPurchaseDetail } from "@/lib/api/cart";
import type { Purchase } from "@/types/purchase";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value);

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleString("es-AR", {
    dateStyle: "full",
    timeStyle: "short",
  });

export function PurchaseDetailClient({
  purchaseId,
}: {
  purchaseId: number;
}): JSX.Element {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(() => {
    if (!purchase) return 0;
    return purchase.items.reduce(
      (acc, item) => acc + item.precio_unitario * item.cantidad,
      0,
    );
  }, [purchase]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      setError("Necesitás iniciar sesión para acceder al detalle.");
      setLoading(false);
      return;
    }

    let ignore = false;
    const loadDetail = async () => {
      try {
        const data = await fetchPurchaseDetail(token, purchaseId);
        if (!ignore) {
          setPurchase(data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          const message =
            err instanceof Error
              ? err.message
              : "No pudimos obtener el detalle de la compra.";
          setError(message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadDetail();
    return () => {
      ignore = true;
    };
  }, [authLoading, token, user, purchaseId]);

  useEffect(() => {
    if (!authLoading && !user) {
      const timeout = setTimeout(() => {
        router.replace("/auth/login");
      }, 1500);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [authLoading, user, router]);

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-10">
          <Link
            href="/compras"
            className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            ← Volver al historial
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">
            Detalle de la compra #{purchaseId}
          </h1>
          <p className="text-sm text-slate-600">
            Revisá los datos del pedido, forma de pago y productos incluidos.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {loading ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center text-sm text-slate-500">
            Cargando detalle de la compra...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : !purchase ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No encontramos información para esta compra.
          </div>
        ) : (
          <div className="space-y-6">
            <section className="grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Información del pedido
                </h2>
                <dl className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <dt>Fecha</dt>
                    <dd className="font-medium text-slate-900">
                      {formatDate(purchase.fecha)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Dirección de entrega</dt>
                    <dd className="font-medium text-slate-900">
                      {purchase.direccion}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Método de pago</dt>
                    <dd className="font-medium text-slate-900">
                      {purchase.tarjeta}
                    </dd>
                  </div>
                </dl>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Resumen de pago
                </h2>
                <dl className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="font-medium text-slate-900">
                      {formatCurrency(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Envío</dt>
                    <dd className="font-medium text-slate-900">
                      {formatCurrency(purchase.envio)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-base font-semibold text-slate-900">
                    <dt>Total abonado</dt>
                    <dd className="text-blue-600">
                      {formatCurrency(purchase.total)}
                    </dd>
                  </div>
                </dl>
              </article>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Productos incluidos ({purchase.items.length})
              </h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Producto</th>
                      <th className="px-4 py-3">Cantidad</th>
                      <th className="px-4 py-3">Precio unitario</th>
                      <th className="px-4 py-3">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                    {purchase.items.map((item) => {
                      const totalItem = item.precio_unitario * item.cantidad;
                      return (
                        <tr key={item.id}>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {item.nombre}
                            <div className="text-xs text-slate-500">
                              ID producto: {item.producto_id}
                            </div>
                          </td>
                          <td className="px-4 py-3">{item.cantidad}</td>
                          <td className="px-4 py-3">
                            {formatCurrency(item.precio_unitario)}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {formatCurrency(totalItem)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}

