"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { obtenerCompra, type Compra } from "@/lib/api";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function CompraDetallePage() {
  const params = useParams<{ id: string }>();
  const compraId = Number(params?.id);
  const [compra, setCompra] = useState<Compra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!compraId) return;
    const run = async () => {
      try {
        setLoading(true);
        const data = await obtenerCompra(compraId);
        setCompra(data);
      } catch (e: any) {
        const msg = e?.message || "";
        setError(msg);
        if (msg.toLowerCase().includes("autentic")) toast("Falta iniciar sesión");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [compraId, toast]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Detalle de Compra</h1>
        <Link href="/compras" className="text-sm text-blue-600 underline">Volver</Link>
      </div>
      {loading && <p>Cargando...</p>}
      {!loading && error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && compra && (
        <>
          <div className="mb-4 text-sm text-gray-700">
            <div className="flex justify-between"><span>Compra #</span><span>{compra.id}</span></div>
            <div className="flex justify-between font-semibold text-indigo-600"><span>Total</span><span>${compra.total.toFixed(2)}</span></div>
          </div>
          <div className="border rounded">
            <div className="grid grid-cols-4 gap-2 p-2 text-xs font-medium bg-gray-50">
              <div>Producto</div>
              <div className="text-right">Cantidad</div>
              <div className="text-right">Precio</div>
              <div className="text-right">Subtotal</div>
            </div>
            {compra.items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 p-2 text-sm border-t">
                <div>{it.titulo ?? `#${it.producto_id}`}</div>
                <div className="text-right">{it.cantidad}</div>
                <div className="text-right">${it.precio_unitario.toFixed(2)}</div>
                <div className="text-right">${(it.subtotal ?? it.cantidad * it.precio_unitario).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
