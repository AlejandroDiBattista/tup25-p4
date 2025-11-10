"use client";

import { useEffect, useState } from "react";
import { obtenerCarrito, quitarDelCarrito, cancelarCarrito } from "../services/productos";
import { useCarrito } from "../../context/CarritoContext";

export default function Carrito() {
  const [items, setItems] = useState<any[]>([]);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const { actualizarCarrito } = useCarrito();

  useEffect(() => {
    const id = Number(localStorage.getItem("usuario_id"));
    setUsuarioId(id || null);
  }, []);

  useEffect(() => {
    if (!usuarioId) return;
    obtenerCarrito(usuarioId).then(setItems).catch(console.error);
  }, [usuarioId, actualizarCarrito]);

  if (!usuarioId) {
    return <div className="p-4 border rounded-lg text-gray-600 bg-white">Inicia sesión para ver tu carrito.</div>;
  }

  if (items.length === 0) {
    return <div className="p-4 border rounded-lg text-gray-600 bg-white">Tu carrito está vacío.</div>;
  }

  const subtotal = items.reduce((acc, it) => acc + it.subtotal, 0);

  const iva = items.reduce((acc, it) => {
    const rate = (it.categoria || "").toLowerCase() === "electrónica" ? 0.10 : 0.21;
    return acc + it.subtotal * rate;
  }, 0);

  const envio = subtotal > 1000 ? 0 : 50;
  const total = +(subtotal + iva + envio).toFixed(2);

  async function handleQuitar(producto_id: number) {
    if (!usuarioId) return;
    await quitarDelCarrito(usuarioId, producto_id);
    const nuevos = await obtenerCarrito(usuarioId);
    setItems(nuevos);
    actualizarCarrito();
  }

  async function handleCancelar() {
    if (!usuarioId) return;
    await cancelarCarrito(usuarioId);
    const nuevos = await obtenerCarrito(usuarioId);
    setItems(nuevos);
    actualizarCarrito();
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm sticky top-6">
      <h2 className="text-xl font-semibold mb-3">Carrito</h2>

      {items.map((item) => (
        <div key={item.producto_id} className="flex justify-between items-center py-2 text-sm border-b">
          <div className="flex flex-col">
            <span className="font-medium">{item.nombre}</span>
            <span className="text-gray-500">x{item.cantidad}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold">${item.subtotal.toFixed(2)}</span>
            <button
              onClick={() => handleQuitar(item.producto_id)}
              className="text-red-600 hover:text-red-700"
              title="Quitar del carrito"
            >
              Quitar
            </button>
          </div>
        </div>
      ))}

      <hr className="my-3" />

      <div className="text-sm space-y-1">
        <div className="flex justify-between"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>IVA:</span> <span>${iva.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Envío:</span> <span>${envio.toFixed(2)}</span></div>
        <div className="flex justify-between font-semibold text-lg mt-2">
          <span>Total:</span> <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        onClick={() => (window.location.href = "/finalizar-compra")}
      >
        Continuar compra
      </button>

      <button
        className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded"
        onClick={handleCancelar}
      >
        Cancelar compra
      </button>
    </div>
  );
}
