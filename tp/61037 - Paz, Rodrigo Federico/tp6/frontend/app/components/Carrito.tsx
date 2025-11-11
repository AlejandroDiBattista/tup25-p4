"use client";

import { useEffect, useState } from "react";
import {
  obtenerCarrito,
  quitarDelCarrito,
  agregarAlCarrito,
  cancelarCarrito,
} from "../services/productos";
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
    if (usuarioId) {
      obtenerCarrito(usuarioId).then(setItems).catch(console.error);
    }
  }, [usuarioId, actualizarCarrito]);

  if (!usuarioId) {
    return (
      <div className="p-4 border rounded-lg text-gray-600 bg-white shadow-sm">
        Inicia sesión para ver tu carrito.
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-4 border rounded-lg text-gray-600 bg-white shadow-sm">
        Tu carrito está vacío.
      </div>
    );
  }

  const subtotal = items.reduce((acc, it) => acc + it.subtotal, 0);

  const iva = items.reduce((acc, it) => {
    const rate = (it.categoria || "").toLowerCase() === "electrónica" ? 0.10 : 0.21;
    return acc + it.subtotal * rate;
  }, 0);

  const envio = subtotal > 1000 ? 0 : 50;
  const total = +(subtotal + iva + envio).toFixed(2);

  async function handleRestar(id: number) {
    if (!usuarioId) return;

    const item = items.find((x) => x.producto_id === id);
    if (!item || item.cantidad <= 1) return;

    await quitarDelCarrito(usuarioId, id);
    await agregarAlCarrito(usuarioId, id); // Reagregamos pero 1 menos
    const nuevos = await obtenerCarrito(usuarioId);
    setItems(nuevos);
    actualizarCarrito();
  }

  async function handleSumar(id: number) {
    if (!usuarioId) return;
    await agregarAlCarrito(usuarioId, id);
    const nuevos = await obtenerCarrito(usuarioId);
    setItems(nuevos);
    actualizarCarrito();
  }

  async function handleCancelar() {
    if (!usuarioId) return;
    await cancelarCarrito(usuarioId);
    setItems([]);
    actualizarCarrito();
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm sticky top-6">
      {items.map((item) => (
        <div key={item.producto_id} className="flex items-center justify-between py-3 border-b">
          <div className="flex items-center gap-3">
            <img
              src={`${API_URL}/imagenes/${item.producto_id.toString().padStart(4, "0")}.png`}
              className="w-14 h-14 rounded object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{item.nombre}</p>
              <p className="text-xs text-gray-500">${item.precio.toFixed(2)} c/u</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="border rounded px-2 text-sm"
              onClick={() => handleRestar(item.producto_id)}
            >
              -
            </button>
            <span className="text-sm">{item.cantidad}</span>
            <button
              className="border rounded px-2 text-sm"
              onClick={() => handleSumar(item.producto_id)}
            >
              +
            </button>
          </div>

          <p className="text-sm font-semibold">${item.subtotal.toFixed(2)}</p>
        </div>
      ))}

      <div className="text-sm space-y-1 mt-4">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>IVA:</span>
          <span>${iva.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Envío:</span>
          <span>${envio.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg text-gray-900 border-t pt-2 mt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={handleCancelar}
          className="w-1/2 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
        >
          Cancelar
        </button>

        <button
          onClick={() => (window.location.href = "/finalizar-compra")}
          className="w-1/2 py-2 rounded-md bg-[#0A2540] hover:bg-[#0D3158] text-white"
        >
          Continuar compra
        </button>
      </div>
    </div>
  );
}
