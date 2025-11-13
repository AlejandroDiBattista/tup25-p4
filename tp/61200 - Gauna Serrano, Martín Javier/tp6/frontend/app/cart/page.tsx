"use client";
import { useEffect, useState } from "react";
import { getCart, removeFromCart, finalizeCart, cancelCart } from "../services/cart";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [direccion, setDireccion] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const router = useRouter();

  async function load() {
    const c = await getCart();
    setCart(c);
  }

  useEffect(() => { load(); }, []);

  async function handleRemove(productId: number) {
    await removeFromCart(productId);
    load();
  }

  async function handleFinalize(e: React.FormEvent) {
    e.preventDefault();
    const res = await finalizeCart(direccion, tarjeta);
    if (res.ok) {
      alert("Compra finalizada");
      router.push("/orders");
    } else {
      alert("Error al finalizar");
    }
  }

  async function handleCancel() {
    await cancelCart();
    load();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Resumen del carrito</h2>
          {cart?.items?.length ? (
            cart.items.map((it: any) => (
              <div key={it.product_id} className="flex items-center justify-between py-2 border-b">
                <div>
                  <div className="font-semibold">{it.nombre ?? it.product_id}</div>
                  <div className="text-sm text-gray-600">Cantidad: {it.cantidad}</div>
                </div>
                <div>
                  <button className="text-red-600" onClick={() => handleRemove(it.product_id)}>Quitar</button>
                </div>
              </div>
            ))
          ) : (
            <div>No hay items</div>
          )}
          <div className="mt-4">
            <div>Subtotal: ${cart?.subtotal ?? 0}</div>
            <div>IVA: ${cart?.iva ?? 0}</div>
            <div>Envío: ${cart?.envio ?? 0}</div>
            <div className="font-bold">Total: ${cart?.total ?? 0}</div>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Datos de envío</h2>
          <form onSubmit={handleFinalize}>
            <label className="block mb-2">Dirección</label>
            <input className="w-full border p-2 mb-3" value={direccion} onChange={e => setDireccion(e.target.value)} />
            <label className="block mb-2">Tarjeta</label>
            <input className="w-full border p-2 mb-3" value={tarjeta} onChange={e => setTarjeta(e.target.value)} />
            <div className="flex gap-2">
              <button type="button" onClick={handleCancel} className="px-3 py-2 border rounded">Cancelar</button>
              <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Confirmar compra</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
