"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CompraResumen {
  id: number;
  fecha: string;
  total: number;
  envio: number;
  direccion: string;
}

export default function ComprasPage() {
  const [compras, setCompras] = useState<CompraResumen[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:8000/compras", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setCompras);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Historial de compras</h2>
      {compras.length === 0 ? (
        <div className="text-center text-gray-900">No hay compras realizadas.</div>
      ) : (
        <ul className="divide-y">
          {compras.map(c => (
            <li key={c.id} className="py-4 flex justify-between items-center">
              <div>
                <div className="font-semibold">Compra #{c.id}</div>
                <div className="text-sm text-gray-900">Fecha: {c.fecha}</div>
                <div className="text-sm text-gray-900">Dirección: {c.direccion}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">Total: ${c.total}</div>
                <div className="text-xs text-gray-900">Envío: ${c.envio}</div>
                <button
                  className="text-blue-600 underline mt-2"
                  onClick={() => router.push(`/compras/${c.id}`)}
                >
                  Ver detalle
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
