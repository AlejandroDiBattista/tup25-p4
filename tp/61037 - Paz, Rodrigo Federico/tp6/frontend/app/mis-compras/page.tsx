"use client";

import { useEffect, useState } from "react";
import { obtenerCompras } from "../services/productos";

export default function MisComprasPage() {
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [compras, setCompras] = useState<any[]>([]);

  useEffect(() => {
    const id = Number(localStorage.getItem("usuario_id"));
    if (!id) window.location.href = "/ingresar";
    setUsuarioId(id || null);

    async function load() {
      if (!id) return;
      const data = await obtenerCompras(id);
      setCompras(data);
    }
    load();
  }, []);

  return (
    <main className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Mis compras</h1>

      <div className="bg-white border rounded-lg">
        {compras.length === 0 ? (
          <p className="p-6 text-gray-600">No tenés compras todavía.</p>
        ) : (
          <ul className="divide-y">
            {compras.map((c) => (
              <li key={c.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Compra #{c.id}</p>
                  <p className="text-sm text-gray-600">
                    {c.fecha} — Envío: ${c.envio.toFixed(2)} — IVA: ${c.iva.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Tarjeta: {c.tarjeta}</p>
                  <p className="text-sm text-gray-600">Dirección: {c.direccion}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">${c.total.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
