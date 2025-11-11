"use client";
import { useEffect, useState } from "react";
import { Compras } from "../../services/productos";

interface ItemCompra {
  producto_id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
}

interface CompraDetalleData {
  id: number;
  fecha: string;
  direccion: string;
  total: number;
  envio: number;
  items: ItemCompra[];
}

export default function CompraDetalle({
  params,
}: {
  params: { id: string };
}) {
  const [data, setData] = useState<CompraDetalleData | null>(null);

  useEffect(() => {
    void (async () => {
      const detalle = await Compras.detalle(Number(params.id));
      setData(detalle);
    })();
  }, [params.id]);

  if (!data) return <div className="card">Cargando detalle...</div>;

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Compra #{data.id}</h1>

      <div className="card">
        <div>Fecha: {new Date(data.fecha).toLocaleString()}</div>
        <div>Dirección: {data.direccion}</div>
        <div>Envío: ${data.envio.toFixed(2)}</div>
        <div className="font-bold">Total: ${data.total.toFixed(2)}</div>
      </div>

      <div className="space-y-2">
        {data.items.map((it) => (
          <div key={it.producto_id} className="card flex justify-between">
            <div>{it.nombre}</div>
            <div>
              Cant: {it.cantidad} · ${it.precio_unitario.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
