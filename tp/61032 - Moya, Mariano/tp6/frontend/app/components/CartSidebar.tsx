"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Producto } from "../types";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function CartSidebar() {
  const [items, setItems] = useState<{ id: number; cantidad: number }[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    setItems(carrito);
    fetch("http://localhost:8000/productos").then(r=>r.json()).then(setProductos);
    const handler = () => setItems(JSON.parse(localStorage.getItem("carrito") || "[]"));
    window.addEventListener("storage", handler);
    window.addEventListener("carrito:changed", handler as EventListener);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("carrito:changed", handler as EventListener);
    };
  }, []);

  const enriched = items.map(it => {
    const p = productos.find(pr => pr.id === it.id);
    return p ? { ...p, cantidad: it.cantidad } : null;
  }).filter(Boolean) as (Producto & { cantidad: number })[];

  const subtotal = enriched.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const iva = +(enriched.reduce((acc, p) => {
    const esElectronico = (p.categoria || "").toLowerCase().includes("electr");
    const rate = esElectronico ? 0.10 : 0.21;
    return acc + p.precio * p.cantidad * rate;
  }, 0)).toFixed(2);
  const envio = subtotal > 50000 ? 0 : 1000;
  const total = +(subtotal + iva + envio).toFixed(2);

  const updateLocal = (list: { id: number; cantidad: number }[]) => {
    localStorage.setItem("carrito", JSON.stringify(list));
    setItems(list);
    window.dispatchEvent(new Event("carrito:changed"));
  };

  const inc = (id: number) => {
    const next = items.map(i => ({ ...i }));
    const it = next.find(i => i.id === id);
    const p = productos.find(pr => pr.id === id);
    if (!it || !p) return;
    if (it.cantidad < p.existencia) {
      it.cantidad += 1;
      updateLocal(next);
    }
  };
  const dec = (id: number) => {
    let next = items.map(i => ({ ...i }));
    const it = next.find(i => i.id === id);
    if (!it) return;
    if (it.cantidad > 1) {
      it.cantidad -= 1;
      updateLocal(next);
    } else {
      next = next.filter(i => i.id !== id);
      updateLocal(next);
    }
  };
  const clear = () => updateLocal([]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carrito</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
          {enriched.length === 0 ? (
            <div className="text-sm text-gray-900">Tu carrito está vacío.</div>
          ) : (
            enriched.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm text-gray-900 border rounded-md p-2">
                <div>
                  <div className="font-medium line-clamp-1 max-w-[160px]">{p.titulo}</div>
                  <div className="text-xs">Cantidad: {p.cantidad}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => dec(p.id)}>-</Button>
                  <Button variant="outline" size="sm" onClick={() => inc(p.id)}>+</Button>
                  <div className="w-16 text-right">${(p.precio * p.cantidad).toFixed(2)}</div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 text-sm text-gray-900 space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>IVA</span><span>${iva.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Envío</span><span>${envio.toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={clear}>Cancelar</Button>
          <Link href="/compra" className="flex-1"><Button className="w-full">Continuar compra</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}
