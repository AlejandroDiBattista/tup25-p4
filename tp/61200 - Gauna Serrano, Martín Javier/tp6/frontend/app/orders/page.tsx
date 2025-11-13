"use client";
import { useEffect, useState } from "react";
import { getPurchases } from "../services/cart";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getPurchases();
      setOrders(res || []);
    })();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Mis compras</h2>
      <div className="grid gap-4">
        {orders.length ? orders.map(o => (
          <div key={o.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>Compra #{o.id}</div>
              <div className="font-bold">${o.total}</div>
            </div>
            <div className="text-sm text-gray-600">Fecha: {o.fecha}</div>
          </div>
        )) : <div>No hay compras</div>}
      </div>
    </div>
  );
}
