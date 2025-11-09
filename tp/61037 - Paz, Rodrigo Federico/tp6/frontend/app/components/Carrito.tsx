"use client";

import { useEffect, useState } from "react";
import { obtenerCarrito } from "../services/productos";
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
    return <div className="p-4 border rounded-lg text-gray-600">Inicia sesión para ver tu carrito.</div>;
  }

  if (items.length === 0) {
    return <div className="p-4 border rounded-lg text-gray-600">Tu carrito está vacío.</div>;
  }

  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const iva = +(subtotal * 0.21).toFixed(2);
  const envio = subtotal > 1000 ? 0 : 50;
  const total = +(subtotal + iva + envio).toFixed(2);

return (
  <div className="p-4 border rounded-lg bg-white shadow-sm sticky top-6">
    <h2 className="text-xl font-semibold mb-3">Carrito</h2>

    {items.map((item) => (
      <div key={item.producto_id} className="flex justify-between py-2 text-sm border-b">
        <span>{item.nombre}</span>
        <span>x{item.cantidad}</span>
        <span className="font-semibold">${item.subtotal.toFixed(2)}</span>
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
  </div>
);
}
