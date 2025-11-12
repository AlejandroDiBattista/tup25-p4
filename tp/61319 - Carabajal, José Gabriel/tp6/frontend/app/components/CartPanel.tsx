"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider"; // << usa tu contexto de sesión
import { getCart, addItem, removeItem, cancelarCarrito } from "../services/carrito";
import type { CartView } from "../types"; // tu archivo types.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CartPanel() {
  const router = useRouter();
  const { session, hydrated } = useAuth(); // << clave para no leer antes de tiempo
  const usuarioId = session?.user.id ?? null;

  const [cart, setCart] = useState<CartView | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    if (!usuarioId) return;
    setLoading(true);
    setErr(null);
    try {
      const data = await getCart(usuarioId);
      setCart(data);
    } catch (e: any) {
      setErr(e?.message ?? "Error al cargar carrito");
    } finally {
      setLoading(false);
    }
  }

  // cargar carrito cuando haya usuario y el cliente ya esté hidratado
  useEffect(() => {
    if (hydrated && usuarioId) refresh();
    if (!usuarioId) setCart(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, usuarioId]);

  async function inc(prodId: number) {
    if (!usuarioId) return;
    setLoading(true);
    try {
      const data = await addItem(usuarioId, prodId, 1);
      setCart(data);
      window.dispatchEvent(new CustomEvent("cart:updated"));
    } finally {
      setLoading(false);
    }
  }

  async function dec(prodId: number) {
    if (!usuarioId || !cart) return;
    setLoading(true);
    try {
      const currentQty = cart.items.find(i => i.producto_id === prodId)?.cantidad ?? 0;
      // si queda en 0, removeItem ya lo saca
      const afterRemove = await removeItem(usuarioId, prodId);
      if (currentQty - 1 > 0) {
        const data = await addItem(usuarioId, prodId, currentQty - 1);
        setCart(data);
      } else {
        setCart(afterRemove);
      }
      window.dispatchEvent(new CustomEvent("cart:updated"));
    } finally {
      setLoading(false);
    }
  }

  async function quitar(prodId: number) {
    if (!usuarioId) return;
    setLoading(true);
    try {
      const data = await removeItem(usuarioId, prodId);
      setCart(data);
      window.dispatchEvent(new CustomEvent("cart:updated"));
    } finally {
      setLoading(false);
    }
  }

  async function cancelar() {
    if (!usuarioId) return;
    if (!confirm("¿Cancelar el carrito actual?")) return;
    setLoading(true);
    try {
      const data = await cancelarCarrito(usuarioId);
      setCart(data);
      window.dispatchEvent(new CustomEvent("cart:updated"));
    } finally {
      setLoading(false);
    }
  }

  const isEmpty = !cart || cart.items.length === 0;

  // 1) mientras no esté hidratado, no muestres nada definitivo
  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
        Cargando…
      </div>
    );
  }

  // 2) si no hay sesión (post-hidratación), ahí sí mostrar el mensaje
  if (!usuarioId) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
        Iniciá sesión para ver tu carrito.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold mb-3">Carrito</h2>

      {loading && <p className="text-sm text-gray-500">Cargando...</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      {isEmpty ? (
        <div className="text-sm text-gray-500">Tu carrito está vacío.</div>
      ) : (
        <>
          <div className="space-y-3">
            {cart!.items.map((it) => {
              const reachedMax = it.cantidad >= it.max_cantidad;
              const agotado = it.stock_disponible <= 0;
              return (
                <div key={it.producto_id} className="flex gap-3 items-start">
                  <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-md border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${API_URL}/${it.imagen}`}
                      alt={it.nombre}
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{it.nombre}</p>
                      <p className="text-sm font-semibold">
                        ${(it.precio_unitario * it.cantidad).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      ${it.precio_unitario.toFixed(2)} c/u
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => dec(it.producto_id)}
                        className="px-2 py-1 rounded-md border text-sm"
                        disabled={loading || it.cantidad <= 1}
                        aria-label="Disminuir"
                      >
                        –
                      </button>

                      <span className="text-sm">Cantidad: {it.cantidad}</span>

                      <button
                        onClick={() => inc(it.producto_id)}
                        className="px-2 py-1 rounded-md border text-sm"
                        disabled={loading || reachedMax || agotado}
                        aria-label="Aumentar"
                        title={
                          agotado
                            ? "Sin stock"
                            : reachedMax
                            ? "Alcanzaste el máximo disponible"
                            : "Aumentar cantidad"
                        }
                      >
                        +
                      </button>

                      <button
                        onClick={() => quitar(it.producto_id)}
                        className="ml-auto px-2 py-1 rounded-md border text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Quitar
                      </button>

                      {agotado && (
                        <span className="text-xs text-red-600 ml-2">Agotado</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totales */}
          <div className="mt-4 border-t pt-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cart!.totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA</span>
              <span>${cart!.totals.iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>${cart!.totals.envio.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base mt-1">
              <span>Total</span>
              <span>${cart!.totals.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-4 flex gap-2">
            <button onClick={cancelar} className="px-3 py-2 rounded-md border text-sm" disabled={loading}>
              Cancelar
            </button>
            <button
              onClick={() => router.push("/finalizar-compra")}
              className="ml-auto px-3 py-2 rounded-md bg-gray-900 text-white text-sm"
              disabled={loading || isEmpty}
            >
              Continuar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}
