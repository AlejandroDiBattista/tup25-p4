"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { fetchPurchases } from "@/lib/api/cart";
import type { Purchase } from "@/types/purchase";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value);

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export function PurchaseHistoryClient(): JSX.Element {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalGastado = useMemo(
    () => purchases.reduce((acc, purchase) => acc + purchase.total, 0),
    [purchases],
  );

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      setError("Necesitás iniciar sesión para ver tus compras.");
      setLoading(false);
      return;
    }

    let ignore = false;
    const loadPurchases = async () => {
      try {
        const data = await fetchPurchases(token);
        if (!ignore) {
          setPurchases(data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          const message =
            err instanceof Error
              ? err.message
              : "No pudimos obtener tu historial.";
          setError(message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadPurchases();
    return () => {
      ignore = true;
    };
  }, [authLoading, token, user]);

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
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
            Historial de compras
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Tus pedidos anteriores
          </h1>
          <p className="text-sm text-slate-600">
            Revisá el detalle de cada compra realizada, incluyendo costos y productos
            adquiridos.
          </p>
          {purchases.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
              Total gastado:{" "}
              <span className="font-semibold text-slate-900">
                {formatCurrency(totalGastado)}
              </span>{" "}
              en {purchases.length} compra
              {purchases.length === 1 ? "" : "s"}.
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {loading ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center text-sm text-slate-500">
            Cargando tus compras...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : purchases.length === 0 ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <span className="text-4xl" aria-hidden="true">
              📦
            </span>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              Aún no registramos compras
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Cuando finalices tu primera compra vas a poder verla acá con todos los
              detalles.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <section className="space-y-4">
            {purchases.map((purchase) => (
              <article
                key={purchase.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Compra #{purchase.id}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {formatDate(purchase.fecha)} • {purchase.items.length} producto
                    {purchase.items.length === 1 ? "" : "s"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Envío: {formatCurrency(purchase.envio)} • Total:{" "}
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(purchase.total)}
                    </span>
                  </p>
                </div>
                <Link
                  href={`/compras/${purchase.id}`}
                  className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Ver detalle
                </Link>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
}

