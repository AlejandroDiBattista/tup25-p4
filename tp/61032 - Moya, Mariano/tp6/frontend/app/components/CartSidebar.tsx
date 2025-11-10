"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Producto } from "../types";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function CartSidebar() {
  const [items, setItems] = useState<{ id: number; cantidad: number }[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("carrito") || "[]");
    }
    return [];
  });
  const [productos, setProductos] = useState<Producto[]>([]);
  const [token, setToken] = useState<string | null>(() => (typeof window !== "undefined" ? localStorage.getItem("token") : null));
  interface ApiCartItem { id: number; cantidad: number; nombre?: string; precio?: number }

  const updateLocal = (list: { id: number; cantidad: number }[], emit: boolean = true) => {
    localStorage.setItem("carrito", JSON.stringify(list));
    setItems(list);
    if (emit) window.dispatchEvent(new Event("carrito:changed"));
  };

  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/carrito", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const fromApi: { id: number; cantidad: number }[] = (data.productos || []).map((p: ApiCartItem) => ({ id: p.id, cantidad: p.cantidad }));
      updateLocal(fromApi, false);
    } catch {}
  }, [token]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem("token");
    fetch("http://localhost:8000/productos").then(r=>r.json()).then(setProductos);
    // Si hay token al cargar, sincronizo desde servidor una vez
    (async () => {
      if (t) {
        try {
          const res = await fetch("http://localhost:8000/carrito", { headers: { Authorization: `Bearer ${t}` } });
          if (res.ok) {
            const data = await res.json();
            const fromApi: { id: number; cantidad: number }[] = (data.productos || []).map((p: ApiCartItem) => ({ id: p.id, cantidad: p.cantidad }));
            updateLocal(fromApi, false);
          }
        } catch {}
      }
    })();
    const handler = async () => {
      const ls = JSON.parse(localStorage.getItem("carrito") || "[]");
      setItems(ls);
      const tok = localStorage.getItem("token");
      setToken(tok);
      await fetchCart();
    };
    window.addEventListener("storage", handler);
    window.addEventListener("carrito:changed", handler as EventListener);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("carrito:changed", handler as EventListener);
    };
  }, [fetchCart]);

  // Merge potential duplicated ids to avoid duplicate keys and inconsistent totals
  const mergedMap = items.reduce<Map<number, { id: number; cantidad: number }>>((acc, it) => {
    const prev = acc.get(it.id);
    acc.set(it.id, { id: it.id, cantidad: (prev?.cantidad || 0) + it.cantidad });
    return acc;
  }, new Map());
  const mergedItems = Array.from(mergedMap.values());
  const enriched = mergedItems
    .map((it) => {
      const p = productos.find((pr) => pr.id === it.id);
      return p ? { ...p, cantidad: it.cantidad } : null;
    })
    .filter(Boolean) as (Producto & { cantidad: number })[];

  const subtotal = enriched.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const iva = +(enriched.reduce((acc, p) => {
    const esElectronico = (p.categoria || "").toLowerCase().includes("electr");
    const rate = esElectronico ? 0.10 : 0.21;
    return acc + p.precio * p.cantidad * rate;
  }, 0)).toFixed(2);
  const envio = subtotal > 50000 ? 0 : 1000;
  const total = +(subtotal + iva + envio).toFixed(2);

  

  const inc = async (id: number) => {
    const next = items.map(i => ({ ...i }));
    const it = next.find(i => i.id === id);
    const p = productos.find(pr => pr.id === id);
    if (!it || !p) return;
    if (it.cantidad < p.existencia) {
      if (token) {
        await fetch("http://localhost:8000/carrito", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ producto_id: id, cantidad: 1 }),
        });
        await fetchCart();
      } else {
        it.cantidad += 1;
        updateLocal(next);
      }
    }
  };
  const dec = async (id: number) => {
    let next = items.map(i => ({ ...i }));
    const it = next.find(i => i.id === id);
    if (!it) return;
    if (token) {
      if (it.cantidad > 1) {
        // Reemplazo: DELETE y luego POST con cantidad-1
        await fetch(`http://localhost:8000/carrito/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        await fetch("http://localhost:8000/carrito", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ producto_id: id, cantidad: it.cantidad - 1 }),
        });
      } else {
        await fetch(`http://localhost:8000/carrito/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      }
      await fetchCart();
    } else {
      if (it.cantidad > 1) {
        it.cantidad -= 1;
        updateLocal(next);
      } else {
        next = next.filter(i => i.id !== id);
        updateLocal(next);
      }
    }
  };
  const clear = async () => {
    if (token) {
      await fetch("http://localhost:8000/carrito/cancelar", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      await fetchCart();
    } else {
      updateLocal([]);
    }
  };

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
