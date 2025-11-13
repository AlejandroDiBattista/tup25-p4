"use client";
import { useState, FormEvent } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { data, checkout } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [direccion, setDireccion] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const compra = await checkout(direccion, tarjeta);
      toast("Compra realizada");
      // Redirigir a historial de compras
      router.push("/compras");
    } catch (err: any) {
      const msg = (err?.message || "").toLowerCase();
      if (msg.includes("autentic")) {
        toast("Falta iniciar sesión");
      } else {
        setError(err?.message || "No se pudo finalizar la compra");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      {data && data.items.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-gray-700">
            <div className="flex justify-between"><span>Items</span><span>{data.total_items}</span></div>
            <div className="flex justify-between"><span>Subtotal</span><span>${data.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>IVA</span><span>${data.total_iva.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Envío</span><span>${data.envio.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold text-indigo-600"><span>Total</span><span>${data.total.toFixed(2)}</span></div>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <input
              className="border p-2 w-full"
              placeholder="Dirección de envío"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
              minLength={3}
            />
            <input
              className="border p-2 w-full"
              placeholder="Tarjeta (demo)"
              value={tarjeta}
              onChange={(e) => setTarjeta(e.target.value)}
              required
              minLength={4}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Procesando..." : "Confirmar compra"}
            </button>
          </form>
        </>
      ) : (
        <p className="text-gray-600">Tu carrito está vacío.</p>
      )}
    </div>
  );
}
