"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { listarCompras } from "../services/compras";
import type { CompraDetalleResponse } from "../types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

const maskCard = (value: string) => {
  if (value.length < 4) {
    return "****";
  }
  const lastDigits = value.slice(-4);
  return `**** **** **** ${lastDigits}`;
};

export default function ComprasPage() {
  const [compras, setCompras] = useState<CompraDetalleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = window.localStorage.getItem("token");
        if (!token) {
          setError("Necesitas iniciar sesión para ver tu historial de compras.");
          setLoading(false);
          return;
        }

        const data = await listarCompras(token);
        if (!isMounted) {
          return;
        }
        setCompras(data);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }
        const message = fetchError instanceof Error ? fetchError.message : "No pudimos obtener tus compras.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData().catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-gray-900">Tus compras</h1>
        <Link
          href="/"
          className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Volver a la tienda
        </Link>
      </div>

      {loading && (
        <p className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
          Cargando historial...
        </p>
      )}

      {error && !loading && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && compras.length === 0 && (
        <p className="mt-6 rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
          Aún no registramos compras en tu cuenta.
        </p>
      )}

      <section className="mt-8 space-y-6">
        {compras.map((compra) => (
          <article key={compra.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Compra #{compra.id}</h2>
                <p className="text-sm text-gray-500">Realizada el {new Date(compra.fecha).toLocaleString()}</p>
              </div>
              <div className="text-sm text-gray-700">
                <p>
                  <span className="font-medium">Envío:</span> {compra.direccion}
                </p>
                <p>
                  <span className="font-medium">Tarjeta:</span> {maskCard(compra.tarjeta)}
                </p>
              </div>
            </header>

            <ul className="mt-4 divide-y divide-gray-100">
              {compra.items.map((item) => (
                <li key={`${compra.id}-${item.producto_id}`} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{item.nombre}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                  </div>
                  <div className="text-right text-sm text-gray-700">
                    <p>Precio unitario: {formatCurrency(item.precio_unitario)}</p>
                    <p className="font-semibold text-gray-900">
                      Total: {formatCurrency(item.precio_unitario * item.cantidad)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="mt-4 space-y-2 text-sm text-gray-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(compra.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA</span>
                <span>{formatCurrency(compra.iva)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>{compra.envio === 0 ? "Gratis" : formatCurrency(compra.envio)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(compra.total)}</span>
              </div>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}
