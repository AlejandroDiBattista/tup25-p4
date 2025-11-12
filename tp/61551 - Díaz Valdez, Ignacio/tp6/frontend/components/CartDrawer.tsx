"use client";
import { useCart } from "../context/CartContext";
import { useEffect } from "react";

export default function CartDrawer() {
  const { open, close, data, loading, lastAdded } = useCart();
  // bloquear scroll cuando abierto
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-xl flex flex-col transition-transform duration-300 z-50 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">Tu Carrito</h2>
          <button onClick={close} className="text-sm text-gray-500 hover:text-gray-800">Cerrar</button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && <p>Cargando...</p>}
          {!loading && (!data || data.items.length === 0) && <p className="text-sm text-gray-500">Sin productos aún.</p>}
          {data?.items.map(it => (
            <div key={it.producto_id} className={`border rounded p-3 text-sm relative ${lastAdded===it.producto_id ? 'ring-2 ring-indigo-400 animate-pulse' : ''}`}>
              <div className="font-medium mb-1">{it.titulo}</div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Cant: {it.cantidad}</span>
                <span>${(it.precio_unitario * it.cantidad).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
        {data && (
          <footer className="border-t p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${data.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>IVA</span><span>${data.total_iva.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Envío</span><span>${data.envio.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold text-indigo-600"><span>Total</span><span>${data.total.toFixed(2)}</span></div>
            <button className="w-full bg-indigo-600 text-white rounded py-2 text-sm mt-2 disabled:opacity-50" disabled={data.items.length===0}>Comprar</button>
          </footer>
        )}
      </aside>
    </>
  );
}