"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Producto } from "../types";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function CartSidebar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<{ id: number; cantidad: number }[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("carrito") || "[]");
    }
    return [];
  });
  const [productos, setProductos] = useState<Producto[]>([]);
  const [token, setToken] = useState<string | null>(() => (typeof window !== "undefined" ? localStorage.getItem("token") : null));
  // Cola de sincronización por producto: product_id -> cantidad deseada final
  const pendingRef = useRef<Map<number, number>>(new Map());
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [syncing, setSyncing] = useState(false);
  interface ApiCartItem { id: number; cantidad: number; nombre?: string; precio?: number }

  const updateLocal = (list: { id: number; cantidad: number }[], emit: boolean = true) => {
    localStorage.setItem("carrito", JSON.stringify(list));
    setItems(list);
    if (emit) window.dispatchEvent(new Event("carrito:changed"));
  };

  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/carrito", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      const fromApi: { id: number; cantidad: number }[] = (data.productos || []).map((p: ApiCartItem) => ({ id: p.id, cantidad: p.cantidad }));
      // Sólo cargar inicial si no hay cambios pendientes
      if (pendingRef.current.size === 0 && !syncing) {
        updateLocal(fromApi, false);
      }
    } catch {}
  }, [token, syncing]);

  useEffect(() => {
    setMounted(true);
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
  // Envío: gratis si subtotal > 1000; $50 si hay productos y subtotal <= 1000; 0 si vacío
  const envio = subtotal === 0 ? 0 : (subtotal > 1000 ? 0 : 50);
  const total = +(subtotal + iva + envio).toFixed(2);

  

  const scheduleSync = () => {
    if (!token) return; // sin token no sincronizo servidor
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(async () => {
      const pending = new Map(pendingRef.current); // copia estable
      if (pending.size === 0) { syncTimerRef.current = null; return; }
      setSyncing(true);
      try {
        for (const [id, qty] of pending.entries()) {
          // DELETE siempre para estado limpio
          await fetch(`http://localhost:8000/carrito/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
          if (qty > 0) {
            // un único POST con cantidad total (backend lo suma como qty? si no, repetir)
            await fetch("http://localhost:8000/carrito", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ producto_id: id, cantidad: qty }),
            });
          }
        }
        pendingRef.current.clear();
        await fetchCart();
      } finally {
        setSyncing(false);
        syncTimerRef.current = null;
      }
    }, 150); // debounce más corto
  };

  const inc = (id: number) => {
    const next = items.map(i => ({ ...i }));
    const it = next.find(i => i.id === id);
    const p = productos.find(pr => pr.id === id);
    if (!it || !p) return;
    if (it.cantidad < p.existencia) {
      it.cantidad += 1;
      updateLocal(next);
      if (token) {
        pendingRef.current.set(id, it.cantidad);
        scheduleSync();
      }
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
    if (token) {
      const nuevo = next.find(i => i.id === id)?.cantidad || 0;
      pendingRef.current.set(id, nuevo);
      scheduleSync();
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
        {!mounted ? (
          <div className="text-sm text-gray-600">Cargando carrito...</div>
        ) : !token ? (
          <div className="rounded-lg border border-gray-200 bg-white text-gray-600 px-3 py-2 text-sm">Inicia sesión para ver y editar tu carrito.</div>
        ) : (
          <>
            <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
              {enriched.length === 0 ? (
                <div className="text-sm text-gray-900">Tu carrito está vacío.</div>
              ) : (
                enriched.map(p => {
                  const disabled = syncing; // deshabilito mientras se aplican cambios en lote
                  return (
                    <div key={p.id} className="flex items-center justify-between text-sm text-gray-900 border rounded-md p-2">
                      <div>
                        <div className="font-medium line-clamp-1 max-w-[160px]">{p.titulo}</div>
                        <div className="text-xs">Cantidad: {p.cantidad}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => dec(p.id)} disabled={disabled}>-</Button>
                        <Button variant="outline" size="sm" onClick={() => inc(p.id)} disabled={disabled}>+</Button>
                        <div className="w-16 text-right">${(p.precio * p.cantidad).toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })
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
              <Button className="flex-1" onClick={() => router.push(token ? "/compra" : "/login")}>Continuar compra</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
