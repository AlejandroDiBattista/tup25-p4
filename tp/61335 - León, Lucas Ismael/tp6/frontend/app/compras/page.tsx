"use client";
import { useEffect, useState } from 'react';
import { listarCompras, detalleCompra } from '../services/orden';

type Compra = { id: number; fecha: string; total: number };
type Item = { producto_id: number; titulo: string; cantidad: number; precio_unitario: number; subtotal: number };
type CompraDetalle = { id: number; fecha: string; subtotal: number; iva: number; envio: number; total: number };

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [detalle, setDetalle] = useState<{ compra: CompraDetalle; items: Item[] } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await listarCompras();
        setCompras(res);
        if (res.length > 0) setSeleccion(res[0].id);
      } catch {
        alert('Iniciá sesión para ver tus compras');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (seleccion == null) return;
    (async () => {
      try {
        const det = await detalleCompra(seleccion);
        setDetalle(det);
      } catch {}
    })();
  }, [seleccion]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <h1 className="text-xl font-semibold mb-2">Mis compras</h1>
        {compras.length === 0 && <p>No tenés compras todavía.</p>}
        <ul className="space-y-2">
          {compras.map((c) => (
            <li
              key={c.id}
              className={`border rounded p-3 cursor-pointer ${seleccion === c.id ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
              onClick={() => setSeleccion(c.id)}
            >
              <div className="text-sm text-gray-600">{new Date(c.fecha).toLocaleString()}</div>
              <div className="font-semibold">Total: ${c.total.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-2">
        <h2 className="font-semibold mb-2">Detalle</h2>
        {!detalle ? (
          <p>Seleccioná una compra para ver el detalle.</p>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Fecha: {new Date(detalle.compra.fecha).toLocaleString()}</div>
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Producto</th>
                  <th className="text-right p-2">Cant.</th>
                  <th className="text-right p-2">Precio</th>
                  <th className="text-right p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalle.items.map((it) => (
                  <tr key={it.producto_id} className="border-t">
                    <td className="p-2">{it.titulo}</td>
                    <td className="p-2 text-right">{it.cantidad}</td>
                    <td className="p-2 text-right">${it.precio_unitario.toFixed(2)}</td>
                    <td className="p-2 text-right">${it.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
