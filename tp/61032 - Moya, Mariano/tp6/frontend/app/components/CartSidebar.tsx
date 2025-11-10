"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Producto } from "../types";

export default function CartSidebar() {
  const [items, setItems] = useState<{ id: number; cantidad: number }[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    setItems(carrito);
    fetch("http://localhost:8000/productos").then(r=>r.json()).then(setProductos);
    const handler = () => setItems(JSON.parse(localStorage.getItem("carrito") || "[]"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const enriched = items.map(it => {
    const p = productos.find(pr => pr.id === it.id);
    return p ? { ...p, cantidad: it.cantidad } : null;
  }).filter(Boolean) as (Producto & { cantidad: number })[];

  const subtotal = enriched.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const iva = +(subtotal * 0.21).toFixed(2);
  const envio = subtotal > 50000 ? 0 : 1000;
  const total = +(subtotal + iva + envio).toFixed(2);

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm">
      <h3 className="font-semibold mb-3 text-gray-900">Carrito</h3>
      <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
        {enriched.length === 0 ? (
          <div className="text-sm text-gray-600">Tu carrito está vacío.</div>
        ) : (
          enriched.map(p => (
            <div key={p.id} className="flex justify-between text-sm">
              <div className="text-gray-800">
                <div className="font-medium">{p.titulo}</div>
                <div className="text-xs text-gray-500">Cantidad: {p.cantidad}</div>
              </div>
              <div className="text-gray-800">${(p.precio * p.cantidad).toFixed(2)}</div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 text-sm text-gray-800 space-y-1">
        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>IVA</span><span>${iva.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Envío</span><span>${envio.toFixed(2)}</span></div>
        <div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>
      <div className="mt-4 flex gap-2">
        <Link href="/compra" className="flex-1 text-center bg-gray-200 text-gray-900 px-3 py-2 rounded hover:bg-gray-300">Cancelar</Link>
        <Link href="/compra" className="flex-1 text-center bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700">Continuar compra</Link>
      </div>
    </div>
  );
}
