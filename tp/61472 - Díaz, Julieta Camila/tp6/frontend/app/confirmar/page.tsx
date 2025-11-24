"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import { useAuth } from "../../src/context/AuthContext";
import { useCart } from "../../src/context/";

export default function ConfirmarCompraPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { cart, fetchCart } = useCart();

  const [direccion, setDireccion] = useState("");
  const [tarjeta, setTarjeta] = useState("");

  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [envio, setEnvio] = useState(50);
  const [total, setTotal] = useState(0);

  // -----------------------------
  // Cargar totales del carrito
  // -----------------------------
  const calcularTotales = () => {
    let sub = 0;
    let ivaCalc = 0;

    cart.items.forEach((item: any) => {
      sub += item.producto.precio * item.cantidad;
      ivaCalc += (item.producto.precio * 0.21) * item.cantidad;
    });

    setSubtotal(sub);
    setIva(ivaCalc);
    setTotal(sub + ivaCalc + envio);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calcularTotales();
  }, [cart]);

  // -----------------------------
  // Confirmar compra
  // -----------------------------
  const confirmarCompra = async () => {
    if (!direccion || !tarjeta) {
      alert("Debes completar todos los datos.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/compras/finalizar?direccion=${direccion}&tarjeta=${tarjeta}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Error al confirmar compra");
        return;
      }

      alert("Compra realizada con éxito!");
      router.push("/compras"); // va al historial

    } catch (error) {
      console.log(error);
      alert("Error inesperado");
    }
  };

  if (!user) {
    return (
      <div className="p-4">Debes iniciar sesión para finalizar una compra.</div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Finalizar compra</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Resumen del carrito */}
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Resumen del carrito</h2>

          {cart.items.length === 0 && (
            <p className="text-sm text-slate-500">El carrito está vacío.</p>
          )}

          {cart.items.map((item: any) => (
            <div key={item.producto.id} className="border-b py-2">
              <p className="font-medium">{item.producto.titulo}</p>
              <p className="text-sm text-slate-600">
                Cantidad: {item.cantidad}
              </p>
              <p className="text-sm">
                ${(item.producto.precio * item.cantidad).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="pt-4 text-sm space-y-1">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>IVA: ${iva.toFixed(2)}</p>
            <p>Envío: ${envio.toFixed(2)}</p>

            <p className="font-semibold text-lg">
              Total a pagar: ${total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Datos de envío */}
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Datos de envío</h2>

          <input
            type="text"
            placeholder="Dirección"
            className="w-full px-4 py-2 border rounded-md mb-3"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />

          <input
            type="text"
            placeholder="Tarjeta"
            className="w-full px-4 py-2 border rounded-md mb-6"
            value={tarjeta}
            onChange={(e) => setTarjeta(e.target.value)}
          />

          <button
            onClick={confirmarCompra}
            className="w-full py-2 bg-slate-900 text-white rounded-md hover:bg-slate-700"
          >
            Confirmar compra
          </button>
        </div>
      </div>
    </div>
  );
}