"use client";
import { useEffect, useState } from "react";
import { obtenerCompras, type Compra } from "@/lib/api";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const data = await obtenerCompras();
        setCompras(data);
      } catch (e: any) {
        const msg = e?.message || "";
        setError(msg);
        if (msg.toLowerCase().includes("autentic")) toast("Falta iniciar sesión");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [toast]);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-6">Mis compras</h1>
      {loading && <p>Cargando...</p>}
      {!loading && error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && compras && compras.length === 0 && (
        <p className="text-gray-600">No hay compras registradas.</p>
      )}
      {!loading && compras && compras.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Listado</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {compras.map((c) => (
                <li key={c.id} className="border rounded p-3 flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-medium">Compra #{c.id}</div>
                    <div className="text-gray-600">{c.items.length} items</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-indigo-600">${c.total.toFixed(2)}</span>
                    <Link className="text-sm text-blue-600 underline" href={`/compras/${c.id}`}>Ver detalle</Link>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
