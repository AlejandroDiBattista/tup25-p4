"use client";
import { useEffect, useState } from "react";
import { Compras } from "../services/productos";
import Link from "next/link";

export default function ComprasPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ (async()=> setRows(await Compras.listar()))(); },[]);
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Mis compras</h1>
      {rows.map(r=>(
        <div key={r.id} className="card flex justify-between">
          <div>
            <div className="font-semibold">Compra #{r.id}</div>
            <div className="text-sm">{new Date(r.fecha).toLocaleString()}</div>
            <div>Total: ${r.total}</div>
          </div>
          <Link className="btn" href={`/compras/${r.id}`}>Ver detalle</Link>
        </div>
      ))}
      {rows.length === 0 && <div>No tenés compras todavía.</div>}
    </div>
  );
}
