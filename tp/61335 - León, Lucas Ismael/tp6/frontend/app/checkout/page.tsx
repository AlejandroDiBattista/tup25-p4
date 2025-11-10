"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cancelarCarrito, finalizarCompra, verCarrito, actualizarCantidad } from '../services/orden';

type Item = { producto_id: number; titulo: string; imagen?: string; cantidad: number; precio_unitario: number; subtotal: number; iva?: number };

type ResumenCarrito = {
  items: Item[];
  subtotal: number; iva: number; envio: number; total: number;
};

export default function CheckoutPage() {
  const [data, setData] = useState<ResumenCarrito | null>(null);
  const [direccion, setDireccion] = useState('');
  const [tarjeta, setTarjeta] = useState('');
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  async function cargar() {
    setLoading(true);
    try {
      const json = await verCarrito();
      setData(json);
    } catch {
      alert('Tenés que iniciar sesión para ver el checkout');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function onCancelar() {
    if (!confirm('¿Seguro que querés cancelar el carrito?')) return;
    await cancelarCarrito();
    await cargar();
    alert('Carrito cancelado');
  }

  async function onFinalizar() {
    if (!direccion || !tarjeta) { alert('Completá dirección y tarjeta'); return; }
    const res = await finalizarCompra(direccion, tarjeta);
    alert(`Compra finalizada. ID: ${res.compra_id}`);
    setDireccion(''); setTarjeta('');
    await cargar();
  }

  async function onCambiar(producto_id: number, nueva: number) {
    try {
      await actualizarCantidad(producto_id, nueva);
      await cargar();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'No se pudo actualizar';
      alert(msg);
    }
  }

  if (loading) return <p>Cargando...</p>;
  if (!data) return <p>No hay datos del carrito.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-3">
        <h1 className="text-xl font-semibold">Checkout</h1>
        <div className="space-y-2">
          {data.items.map((it) => (
            <div key={it.producto_id} className="flex items-center gap-3 border rounded p-2 bg-white">
              <div className="relative w-20 h-16 bg-gray-100 rounded overflow-hidden">
                {it.imagen && <Image src={`${API_URL}/${it.imagen}`} alt={it.titulo} fill className="object-contain p-1" unoptimized />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate" title={it.titulo}>{it.titulo}</div>
                <div className="text-xs text-gray-500">Precio: ${it.precio_unitario.toFixed(2)} · IVA: ${Number(it.iva||0).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300" onClick={() => onCambiar(it.producto_id, Math.max(0, it.cantidad - 1))}>-</button>
                <span className="w-6 text-center text-sm">{it.cantidad}</span>
                <button className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300" onClick={() => onCambiar(it.producto_id, it.cantidad + 1)}>+</button>
              </div>
              <div className="text-right w-24 font-medium">${it.subtotal.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="border rounded p-3 bg-white text-sm">
          <h2 className="font-semibold mb-2">Resumen</h2>
          <div className="space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>${data.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>IVA</span><span>${data.iva.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Envío</span><span>${data.envio.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold"><span>Total</span><span>${data.total.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="border rounded p-3 bg-white space-y-2">
          <h2 className="font-semibold">Envío y pago</h2>
          <input className="w-full border px-3 py-2 rounded" placeholder="Dirección de envío" value={direccion} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDireccion(e.target.value)} />
          <input className="w-full border px-3 py-2 rounded" placeholder="Tarjeta (16 dígitos)" value={tarjeta} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTarjeta(e.target.value)} />
          <button onClick={onFinalizar} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Finalizar compra</button>
          <button onClick={onCancelar} className="w-full bg-gray-200 hover:bg-gray-300 rounded px-4 py-2">Cancelar carrito</button>
        </div>
      </div>
    </div>
  );
}
