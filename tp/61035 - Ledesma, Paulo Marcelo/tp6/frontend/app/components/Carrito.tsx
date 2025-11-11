"use client";
import { useState } from "react";

export const Carrito = () => {
  const [items, setItems] = useState([]);

  return (
    <aside className="w-80 bg-white/80 rounded-2xl shadow-lg p-4">
      <h2 className="text-lg font-semibold mb-2 text-sky-700">🛒 Carrito</h2>
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">Tu carrito está vacío</p>
      ) : (
        items.map((item, idx) => (
          <div key={idx} className="border-b py-2">
            {item.nombre} — {item.cantidad} x ${item.precio}
          </div>
        ))
      )}
    </aside>
  );
};
