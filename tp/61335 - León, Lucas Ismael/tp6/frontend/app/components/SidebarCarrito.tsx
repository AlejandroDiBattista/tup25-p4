"use client";
import { useEffect, useState } from 'react';
import { cancelarCarrito, verCarrito } from '../services/orden';

type Resumen = {
  items: { producto_id: number; titulo: string; cantidad: number; precio_unitario: number; subtotal: number }[];
  subtotal: number; iva: number; envio: number; total: number;
};

export default function SidebarCarrito() {
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [logged, setLogged] = useState(false);

  async function cargar() {
    try {
      const r = await verCarrito();
      setResumen(r);
      setLogged(true);
    } catch {
      setLogged(false);
      setResumen(null);
    }
  }

  useEffect(() => {
    // Defer para evitar advertencia de setState sincronizado
    Promise.resolve().then(() => cargar());
  }, []);

  async function onCancelar() {
    await cancelarCarrito();
    await cargar();
  }

  return (
    <aside className="space-y-3">
      {!logged && (
        <div className="border rounded bg-white p-3 text-sm text-gray-600">
          Iniciá sesión para ver y editar tu carrito.
        </div>
      )}
      {logged && resumen && (
        <div className="border rounded bg-white p-3">
          <h3 className="font-semibold mb-2">Resumen</h3>
          <div className="space-y-2 max-h-64 overflow-auto pr-1">
            {resumen.items.map((it) => (
              <div key={it.producto_id} className="flex items-center justify-between text-sm">
                <div className="truncate mr-2">
                  <div className="font-medium truncate" title={it.titulo}>{it.titulo}</div>
                  <div className="text-gray-500">Cantidad: {it.cantidad}</div>
                </div>
                <div className="text-right">${it.subtotal.toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>${resumen.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>IVA</span><span>${resumen.iva.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Envío</span><span>${resumen.envio.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold"><span>Total</span><span>${resumen.total.toFixed(2)}</span></div>
          </div>
          <div className="mt-3 flex gap-2">
            <a href="/carrito" className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm text-center flex-1">Continuar compra</a>
            <button onClick={onCancelar} className="bg-gray-200 hover:bg-gray-300 rounded px-3 py-2 text-sm">Cancelar</button>
          </div>
        </div>
      )}
    </aside>
  );
}
