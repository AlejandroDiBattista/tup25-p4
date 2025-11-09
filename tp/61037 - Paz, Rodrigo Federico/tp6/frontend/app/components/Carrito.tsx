"use client";

import { useEffect, useState } from "react";
import { obtenerCarrito } from "../services/productos";

export default function Carrito() {
  const [items, setItems] = useState<any[]>([]);
  const usuario_id = Number(localStorage.getItem("usuario_id"));

  useEffect(() => {
    if (!usuario_id) return;
    obtenerCarrito(usuario_id).then(setItems).catch(console.error);
  }, []);

  if (!usuario_id) {
    return (
      <div className="p-4 border rounded-lg text-gray-600">
        Inicia sesión para ver y editar tu carrito.
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-4 border rounded-lg text-gray-600">
        Tu carrito está vacío.
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-3">Carrito</h2>

      {items.map((item: any) => (
        <div key={item.id} className="flex justify-between py-2">
          <span>{item.producto_id}</span>
          <span>x{item.cantidad}</span>
        </div>
      ))}
    </div>
  );
}