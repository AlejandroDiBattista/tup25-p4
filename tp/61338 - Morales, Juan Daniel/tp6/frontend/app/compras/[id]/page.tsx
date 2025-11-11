"use client";
import { useEffect, useState } from "react";
import { Compras } from "../../services/productos";

export default function CompraDetalle({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  useEffect(()=>{ (async()=> setData(await Compras.detalle(Number(params.id))))(); },[params.id]);
  if (!data) return <div>Cargando...</div>;
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Compra #{data.id}</h1>
      <div className="card">
        <div>Fecha: {new Date(data.fecha).toLocaleString()}</div>
        <div>Dirección: {data.direccion}</div>
        <div>Envío: ${data.envio}</div>
        <div className="font-bold">Total: ${data.total}</div>
      </div>
      <div className="space-y-2">
        {data.items.map((it:any)=>(
          <div key={it.producto_id} className="card flex justify-between">
            <div>{it.nombre}</div>
            <div>Cant: {it.cantidad} · ${it.precio_unitario}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
