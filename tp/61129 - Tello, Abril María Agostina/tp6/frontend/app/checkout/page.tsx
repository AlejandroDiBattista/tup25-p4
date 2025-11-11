"use client";
import NavBarClient from "../components/NavBarClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function CheckoutPage() {
  const [finalizada, setFinalizada] = useState(false);
  const router = useRouter();
  // Obtener productos seleccionados del carrito desde localStorage
  const carrito = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("carrito") || "[]") : [];
  const subtotal = carrito.reduce((acc: number, item: any) => acc + item.precio * item.cantidad, 0);
  // IVA diferenciado por producto
  const ivaPorProducto = carrito.map((item: any) => {
    const esElectronico = (item.categoria?.toLowerCase() === "electrónica" || item.categoria?.toLowerCase() === "electronica");
    const ivaTasa = esElectronico ? 0.10 : 0.21;
    return item.precio * item.cantidad * ivaTasa;
  });
  const iva = ivaPorProducto.reduce((acc: number, v: number) => acc + v, 0);
  const envio = (carrito.length > 0 && (subtotal + iva) > 1000) ? 0 : (carrito.length > 0 ? 50 : 0);
  const total = subtotal + iva + envio;

  const [direccion, setDireccion] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  // Obtener usuario actual
  const usuario = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("usuario") || "null") : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBarClient />
      <main className="max-w-6xl mx-auto px-4 py-12">
        {!finalizada ? (
          <>
            <h1 className="text-4xl font-extrabold mb-10">Finalizar compra</h1>
            <div className="flex gap-8 w-full">
              <section className="bg-white rounded-2xl shadow p-10 flex-1 border border-gray-200">
                <h2 className="text-2xl font-bold mb-8">Resumen del carrito</h2>
                {carrito.length === 0 ? (
                  <div className="text-gray-500">No hay productos en el carrito.</div>
                ) : (
                  carrito.map((item: any, idx: number) => {
                    const esElectronico = (item.categoria?.toLowerCase() === "electrónica" || item.categoria?.toLowerCase() === "electronica");
                    const ivaTasa = esElectronico ? 0.10 : 0.21;
                    const ivaItem = item.precio * item.cantidad * ivaTasa;
                    return (
                      <div key={idx} className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-semibold text-lg text-gray-900">{item.nombre || item.titulo}</div>
                          <div className="text-gray-500 text-base">Cantidad: {item.cantidad}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-semibold text-gray-900">${item.precio.toFixed(2)}</div>
                          <div className="text-gray-400 text-sm">IVA ({esElectronico ? "10%" : "21%"}): {ivaItem.toFixed(2)}</div>
                        </div>
                      </div>
                    );
                  })
                )}
                <hr className="my-6" />
                <div className="text-base mb-2">Total productos: <span className="font-medium">${subtotal.toFixed(2)}</span></div>
                <div className="text-base mb-2">IVA: <span className="font-medium">${iva.toFixed(2)}</span></div>
                <div className="text-base mb-2">Envío: <span className="font-medium">${envio.toFixed(2)}</span></div>
                <div className="text-xl font-bold mt-4">Total a pagar: <span className="text-black">${total.toFixed(2)}</span></div>
              </section>
              <section className="bg-white rounded-2xl shadow p-10 flex-1 border border-gray-200">
                <h2 className="text-2xl font-bold mb-8">Datos de envío</h2>
                <form className="flex flex-col gap-6" onSubmit={e => {
                  e.preventDefault();
                  // Guardar la compra en localStorage, incluyendo IVA por producto
                  const compras = JSON.parse(localStorage.getItem("compras") || "[]");
                  // Agregar el IVA de cada producto al carrito
                  const carritoConIVA = carrito.map((item: any) => {
                    const esElectronico = (item.categoria?.toLowerCase() === "electrónica" || item.categoria?.toLowerCase() === "electronica");
                    const ivaTasa = esElectronico ? 0.10 : 0.21;
                    return { ...item, iva: item.precio * item.cantidad * ivaTasa };
                  });
                  compras.push({
                    fecha: new Date().toISOString(),
                    carrito: carritoConIVA,
                    subtotal,
                    iva,
                    envio,
                    total,
                    direccion,
                    tarjeta,
                    usuario: usuario?.email ?? null
                  });
                  localStorage.setItem("compras", JSON.stringify(compras));
                  // Vaciar el carrito
                  localStorage.setItem("carrito", JSON.stringify([]));
                  setFinalizada(true);
                }}>
                  <div>
                    <label className="block mb-2 text-base font-semibold text-gray-700">Dirección</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Dirección"
                      required
                      value={direccion}
                      onChange={e => setDireccion(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-base font-semibold text-gray-700">Tarjeta</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Tarjeta"
                      required
                      value={tarjeta}
                      onChange={e => setTarjeta(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded font-bold shadow hover:bg-transparent hover:text-blue-600 border border-blue-600 transition active:scale-95"
                  >Confirmar compra</button>
                </form>
              </section>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-4xl font-extrabold mb-6 text-center">¡Compra finalizada!</h1>
            <p className="text-lg text-gray-700 mb-10 text-center">Gracias por tu compra. Puedes seguir comprando o ver tus compras realizadas.</p>
            <div className="flex gap-6">
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded font-bold shadow hover:bg-transparent hover:text-blue-600 border border-blue-600 transition active:scale-95"
                onClick={() => router.push("/")}
              >Seguir comprando</button>
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded font-bold shadow hover:bg-transparent hover:text-blue-600 border border-blue-600 transition active:scale-95"
                onClick={() => router.push("/compras")}
              >Ver mis compras</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
