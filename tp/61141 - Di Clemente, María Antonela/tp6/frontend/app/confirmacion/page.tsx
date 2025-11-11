"use client";

import { useEffect, useState } from "react";
import { useCarrito } from "@/app/components/CarritoContext"; 
import { Producto } from "../types";

export default function ConfirmarCompra() {
  const { cartItems, cargarCarritoDesdeLocalStorage, vaciarCarrito } = useCarrito();

  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIVA] = useState(0);
  const [envio, setEnvio] = useState(0);
  const [total, setTotal] = useState(0);

  // Cargar carrito y calcular totales
  useEffect(() => {
    cargarCarritoDesdeLocalStorage();
  }, []);

  useEffect(() => {
    calcularTotales(cartItems);
  }, [cartItems]);

  const calcularTotales = (items: any[]) => {
    let sub = 0;
    let ivaTotal = 0;
    items.forEach((item) => {
      const precioItem = item.precio * item.cantidad;
      sub += precioItem;
      const iva = item.categoria?.toLowerCase() === "electrónica" ? 0.1 : 0.21;
      ivaTotal += precioItem * iva;
    });

    const envioCosto = sub + ivaTotal > 1000 ? 0 : 50;
    setSubtotal(sub);
    setIVA(ivaTotal);
    setEnvio(envioCosto);
    setTotal(sub + ivaTotal + envioCosto);
  };

  const finalizarCompra = () => {
    alert("Compra finalizada con éxito!");
    vaciarCarrito();
    window.location.href = "/";
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-8">Finalizar compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resumen del carrito */}
        <div className="border rounded-xl p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">Resumen del carrito</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Tu carrito está vacío.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="mb-4 border-b pb-2">
                <p className="font-medium">{item.titulo}</p>
                <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                <div className="flex justify-between text-gray-700 text-sm mt-1">
                  <span>IVA: ${(item.precio * 0.21).toFixed(2)}</span>
                  <span className="font-medium">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}

          {/*  Totales */}
          <div className="border-t pt-4 mt-2 text-sm">
            <p className="flex justify-between">
              <span>Total productos:</span> <span>${subtotal.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>IVA:</span> <span>${iva.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Envío:</span> <span>${envio.toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-semibold text-lg mt-2">
              <span>Total a pagar:</span> <span>${total.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/*  Datos de envío */}
        <div className="border rounded-xl p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">Datos de envío</h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Dirección"
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Tarjeta"
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={finalizarCompra}
              className="bg-black hover:bg-gray-800 text-white font-semibold py-2 rounded-lg"
            >
              Confirmar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
