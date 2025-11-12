"use client";

import { useEffect, useState } from "react";
import { Producto } from "../types";

interface Compra {
  id: number;
  fecha: string;
  direccion: string;
  tarjeta: string;
  productos: (Producto & { cantidad: number })[];
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
}

export default function MisCompras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [seleccionada, setSeleccionada] = useState<Compra | null>(null);

  useEffect(() => {
    const guardadas = localStorage.getItem("historialCompras");
    if (guardadas) {
      const data = JSON.parse(guardadas);
      setCompras(data);
      setSeleccionada(data[0]);
    }
  }, []);

  return (
    <div className="p-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Mis compras</h1>

      {compras.length === 0 ? (
        <p className="text-gray-500">Todavía no realizaste compras.</p>
      ) : (
        <div className="flex gap-6">
          {/* Lista de compras */}
          <div className="w-1/3 flex flex-col gap-4">
            {compras.map((c) => (
              <button
                key={c.id}
                onClick={() => setSeleccionada(c)}
                className={`p-4 text-left rounded-lg border transition ${
                  seleccionada?.id === c.id
                    ? "border-black bg-gray-100"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <p className="font-semibold">Compra #{c.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(c.fecha).toLocaleString()}
                </p>
                <p className="text-sm font-medium mt-1">
                  Total: ${c.total.toFixed(2)}
                </p>
              </button>
            ))}
          </div>

          {/* Detalle de compra */}
          <div className="flex-1 border border-gray-200 rounded-lg p-6">
            {seleccionada ? (
              <>
                <h2 className="text-lg font-semibold mb-4">Detalle de la compra</h2>
                <div className="flex justify-between text-sm mb-4">
                  <p>
                    <strong>Compra #:</strong> {seleccionada.id}
                    <br />
                    <strong>Dirección:</strong> {seleccionada.direccion}
                  </p>
                  <p className="text-right">
                    <strong>Fecha:</strong>{" "}
                    {new Date(seleccionada.fecha).toLocaleString()}
                    <br />
                    <strong>Tarjeta:</strong> {seleccionada.tarjeta}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  {seleccionada.productos.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between text-sm py-2 border-b border-gray-100"
                    >
                      <div>
                        <p>{p.titulo}</p>
                        <p className="text-gray-500 text-xs">
                          Cantidad: {p.cantidad}
                        </p>
                      </div>
                      <div className="text-right">
                        <p>${p.precio.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          IVA: ${(p.precio * 0.21).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-sm space-y-1">
                  <p>
                    <strong>Subtotal:</strong> ${seleccionada.subtotal.toFixed(2)}
                  </p>
                  <p>
                    <strong>IVA:</strong> ${seleccionada.iva.toFixed(2)}
                  </p>
                  <p>
                    <strong>Envío:</strong> ${seleccionada.envio.toFixed(2)}
                  </p>
                  <p className="font-bold text-lg mt-2">
                    Total pagado: ${seleccionada.total.toFixed(2)}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500">
                Seleccioná una compra para ver el detalle.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
