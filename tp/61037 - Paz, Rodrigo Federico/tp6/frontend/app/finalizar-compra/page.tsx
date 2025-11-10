"use client";

import { useEffect, useState } from "react";
import { finalizarCompra, obtenerCarrito } from "../services/productos";

export default function FinalizarCompraPage() {
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [direccion, setDireccion] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [previsualizacion, setPrevisualizacion] = useState<{ subtotal: number; iva: number; envio: number; total: number } | null>(null);

  useEffect(() => {
    const id = Number(localStorage.getItem("usuario_id"));
    if (!id) window.location.href = "/ingresar";
    setUsuarioId(id || null);

    // cálculo local (misma regla que backend) para mostrar totales antes de pagar
    async function preview() {
      if (!id) return;
      const items = await obtenerCarrito(id);
      const subtotal = items.reduce((acc: number, it: any) => acc + it.subtotal, 0);
      const iva = items.reduce((acc: number, it: any) => {
        const rate = (it.categoria || "").toLowerCase() === "electrónica" ? 0.10 : 0.21;
        return acc + it.subtotal * rate;
      }, 0);
      const envio = subtotal > 1000 ? 0 : 50;
      const total = +(subtotal + iva + envio).toFixed(2);
      setPrevisualizacion({ subtotal, iva, envio, total });
    }
    preview();
  }, []);

  async function handlePagar(e: React.FormEvent) {
    e.preventDefault();
    if (!usuarioId) return;
    const r = await finalizarCompra(usuarioId, direccion, tarjeta);
    alert(r.mensaje || `Compra OK. Total pagado: $${r.total_pagado}`);
    window.location.href = "/mis-compras";
  }

  return (
    <main className="max-w-3xl mx-auto mt-10 px-4">
      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={handlePagar} className="bg-white border rounded-lg p-6 shadow-sm">
          <h1 className="text-xl font-semibold mb-4 text-gray-900">Finalizar compra</h1>

          <label className="text-sm text-gray-700">Dirección</label>
          <input
            className="border w-full rounded-md px-3 py-2 bg-white mb-3"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />

          <label className="text-sm text-gray-700">Tarjeta (16 dígitos)</label>
          <input
            className="border w-full rounded-md px-3 py-2 bg-white mb-4"
            value={tarjeta}
            onChange={(e) => setTarjeta(e.target.value)}
            inputMode="numeric"
            minLength={16}
            maxLength={16}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Pagar
          </button>
        </form>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Resumen</h2>
          {previsualizacion ? (
            <div className="text-sm space-y-1">
              <div className="flex justify-between"><span>Subtotal:</span><span>${previsualizacion.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>IVA:</span><span>${previsualizacion.iva.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Envío:</span><span>${previsualizacion.envio.toFixed(2)}</span></div>
              <div className="flex justify-between font-semibold text-lg mt-2"><span>Total:</span><span>${previsualizacion.total.toFixed(2)}</span></div>
            </div>
          ) : (
            <p className="text-gray-600">Cargando resumen…</p>
          )}
        </div>
      </div>
    </main>
  );
}
