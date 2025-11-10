"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CompraDetalle {
  id: number;
  fecha: string;
  total: number;
  envio: number;
  direccion: string;
  items: { producto_id: number; nombre: string; cantidad: number; precio_unitario: number }[];
}

export default function CompraDetallePage({ params }: { params: { id: string } }) {
  const [detalle, setDetalle] = useState<CompraDetalle | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`http://localhost:8000/compras/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setDetalle);
  }, [params.id]);

  if (!detalle) {
    return <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow bg-white text-center">Cargando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Detalle de compra #{detalle.id}</h2>
      <div className="mb-2">Fecha: {detalle.fecha}</div>
      <div className="mb-2">Dirección: {detalle.direccion}</div>
      <div className="mb-2">Total: ${detalle.total}</div>
      <div className="mb-2">Envío: ${detalle.envio}</div>
      <h3 className="font-semibold mt-4 mb-2">Productos:</h3>
      <ul className="divide-y">
        {detalle.items.map(item => (
          <li key={item.producto_id} className="py-2 flex justify-between">
            <span>{item.nombre} (x{item.cantidad})</span>
            <span>${item.precio_unitario}</span>
          </li>
        ))}
      </ul>
      <button className="mt-6 text-blue-600 underline" onClick={() => router.push("/compras")}>Volver al historial</button>
    </div>
  );
}
