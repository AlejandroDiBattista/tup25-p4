"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import { useAuth } from "../../src/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type CompraItem = {
  nombre: string;
  cantidad: number;
  precio: number;
};

type Compra = {
  id: number;
  fecha: string;
  total: number;
  direccion: string;
  tarjeta: string;
  items: CompraItem[];
};

export default function ComprasPage() {
  const { token } = useAuth();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [seleccionada, setSeleccionada] = useState<Compra | null>(null);

  useEffect(() => {
    async function load() {
      if (!token) return;
      const res = await fetch(`${API_BASE}/compras`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setCompras(data);
      setSeleccionada(data[0] || null);
    }
    load();
  }, [token]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="mb-4 text-xl font-semibold text-slate-900">
          Mis compras
        </h1>
        <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] gap-6">
          {/* lista izquierda */}
          <div className="rounded-xl border bg-white px-4 py-4 text-sm">
            <div className="space-y-3">
              {compras.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSeleccionada(c)}
                  className={`block w-full rounded-md border px-3 py-3 text-left text-sm ${
                    seleccionada?.id === c.id
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-200"
                  }`}
                >
                  <p className="font-semibold">Compra #{c.id}</p>
                  <p className="text-[11px] text-slate-500">
                    {new Date(c.fecha).toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm">Total: ${c.total.toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* detalle derecha */}
          <div className="rounded-xl border bg-white px-5 py-5 text-sm">
            {seleccionada ? (
              <>
                <div className="mb-3 flex justify-between text-sm">
                  <div>
                    <p className="font-semibold">
                      Compra #: {seleccionada.id}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Dirección: {seleccionada.direccion}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">
                      Fecha: {new Date(seleccionada.fecha).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Tarjeta: {seleccionada.tarjeta}
                    </p>
                  </div>
                </div>
                <h3 className="mb-2 text-sm font-semibold">Productos</h3>
                <div className="space-y-2 text-sm">
                  {seleccionada.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between border-b border-slate-100 pb-1"
                    >
                      <div>
                        <p>{it.nombre}</p>
                        <p className="text-[11px] text-slate-500">
                          Cantidad: {it.cantidad}
                        </p>
                      </div>
                      <div className="text-right">
                        <p>${it.precio.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    {/* esto depende de cómo lo mande el backend; acá uso total directo */}
                    <span>${seleccionada.total.toFixed(2)}</span>
                  </div>
                  {/* si tu backend manda iva/envio, los agregás acá */}
                  <div className="mt-1 flex justify-between text-sm font-semibold">
                    <span>Total pagado:</span>
                    <span>${seleccionada.total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Aún no tienes compras registradas.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}