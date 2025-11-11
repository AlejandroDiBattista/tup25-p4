"use client";
import { useEffect, useState } from "react";
import { Compras } from "../services/productos";
import Link from "next/link";

interface Compra {
  id: number;
  fecha: string;
  direccion: string;
  total: number;
  envio: number;
}

export default function ComprasPage() {
  const [rows, setRows] = useState<Compra[]>([]);

  useEffect(() => {
    void (async () => {
      const data = await Compras.listar();
      setRows(data);
    })();
  }, []);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Mis compras</h1>

      {rows.length === 0 ? (
        <div className="card text-gray-600">No tenés compras todavía.</div>
      ) : (
        rows.map((r) => (
          <div key={r.id} className="card flex justify-between">
            <div>
              <div className="font-semibold">Compra #{r.id}</div>
              <div className="text-sm">
                {new Date(r.fecha).toLocaleString()}
              </div>
              <div>Total: ${r.total.toFixed(2)}</div>
            </div>
            <Link className="btn" href={`/compras/${r.id}`}>
              Ver detalle
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
