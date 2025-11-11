"use client";
import { useEffect, useState } from "react";
import { Carrito } from "../services/productos";

export default function CarritoPage() {
  const [data, setData] = useState<any>(null);
  const [direccion, setDireccion] = useState("");
  const [tarjeta, setTarjeta] = useState("");

  const load = async () => { setData(await Carrito.ver()); };
  useEffect(()=>{ load(); },[]);

  const quitar = async (id:number) => { await Carrito.quitar(id); await load(); };
  const cancelar = async () => { await Carrito.cancelar(); await load(); };
  const finalizar = async () => {
    if (!direccion || !tarjeta) { alert("Completá dirección y tarjeta"); return; }
    const r = await Carrito.finalizar(direccion, tarjeta);
    alert(`Compra OK. ID ${r.compra_id} Total ${r.total}`);
    await load();
  };

  if (!data) return <div>Cargando...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Carrito</h1>
      <div className="space-y-2">
        {data.items.map((it:any)=>(
          <div key={it.producto_id} className="card flex justify-between">
            <div>
              <div className="font-semibold">{it.nombre}</div>
              <div>Cant: {it.cantidad} · ${it.precio_unitario.toFixed(2)}</div>
            </div>
            <button className="btn" onClick={()=>quitar(it.producto_id)}>Quitar</button>
          </div>
        ))}
      </div>
      <div className="card">
        <div>Subtotal: ${data.subtotal}</div>
        <div>IVA: ${data.iva}</div>
        <div>Envío: ${data.envio}</div>
        <div className="font-bold">Total: ${data.total}</div>
      </div>

      <div className="card space-y-2">
        <h2 className="font-semibold">Finalizar compra</h2>
        <input className="input" placeholder="Dirección" value={direccion} onChange={e=>setDireccion(e.target.value)} />
        <input className="input" placeholder="Tarjeta (16 dígitos)" value={tarjeta} onChange={e=>setTarjeta(e.target.value)} />
        <div className="flex gap-2">
          <button className="btn" onClick={finalizar}>Pagar</button>
          <button className="btn" onClick={cancelar}>Cancelar carrito</button>
        </div>
      </div>
    </div>
  );
}
