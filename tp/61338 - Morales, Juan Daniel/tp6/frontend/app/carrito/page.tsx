"use client";

import { useEffect, useState } from "react";
import { Carrito } from "../../app/services/productos"; // ✅ ruta corregida
import { Producto } from "../../app/types"; // para tipar los items

// Creamos un tipo de item del carrito basado en tu backend actual
interface CarritoItem {
  producto_id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  imagen?: string | null;
}

export default function CarritoPage() {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [direccion, setDireccion] = useState("");
  const [tarjeta, setTarjeta] = useState("");

  useEffect(() => {
    const fetchCarrito = async () => {
      try {
        const data = await Carrito.ver();
        const items = data.items || [];
        setCarrito(items);
        const total = items.reduce((acc, item) => acc + item.subtotal, 0);
        setSubtotal(total);
      } catch (err) {
        console.error("Error al obtener carrito:", err);
        alert("No se pudo cargar el carrito. Verificá tu sesión.");
      }
    };
    fetchCarrito();
  }, []);

  const iva = subtotal * 0.21;
  const envio = carrito.length > 0 ? 50 : 0;
  const total = subtotal + iva + envio;

  const handleCancelar = async () => {
    try {
      await Carrito.cancelar();
      setCarrito([]);
      alert("Carrito cancelado correctamente.");
    } catch (err) {
      alert("Error al cancelar el carrito.");
    }
  };

  const handlePagar = async () => {
    if (!direccion || !tarjeta) {
      alert("Completá todos los campos para finalizar la compra.");
      return;
    }
    try {
      await Carrito.finalizar(direccion, tarjeta);
      alert("Compra finalizada con éxito.");
      setCarrito([]);
      setDireccion("");
      setTarjeta("");
    } catch (err) {
      alert("Error al finalizar la compra.");
    }
  };

  const handleQuitar = async (producto_id: number) => {
    try {
      await Carrito.quitar(producto_id);
      setCarrito(carrito.filter((item) => item.producto_id !== producto_id));
    } catch (err) {
      alert("Error al quitar el producto del carrito.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0a1d37] text-white py-4 px-6 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          🛍️ TP6 Shop
        </h1>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Carrito</h2>

        {carrito.length === 0 ? (
          <p className="text-gray-600">Tu carrito está vacío.</p>
        ) : (
          <div className="space-y-4">
            {carrito.map((item) => (
              <div
                key={item.producto_id}
                className="flex items-center justify-between bg-white rounded-xl shadow p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.imagen || "/placeholder.png"}
                      alt={item.nombre}
                      className="w-full h-full object-contain rounded-md border"
                    />
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">{item.nombre}</p>
                    <p className="text-sm text-gray-600">
                      Cant: {item.cantidad} • ${item.precio_unitario.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleQuitar(item.producto_id)}
                  className="bg-[#0a1d37] text-white px-3 py-1 rounded-md hover:bg-blue-900"
                >
                  Quitar
                </button>
              </div>
            ))}

            <div className="bg-white p-4 rounded-xl shadow">
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              <p>IVA: ${iva.toFixed(2)}</p>
              <p>Envío: ${envio.toFixed(2)}</p>
              <p className="font-bold text-gray-900">
                Total: ${total.toFixed(2)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow space-y-3">
              <h3 className="font-semibold text-gray-800">Finalizar compra</h3>
              <input
                type="text"
                placeholder="Dirección"
                className="w-full border rounded-md p-2"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
              <input
                type="text"
                placeholder="Tarjeta (16 dígitos)"
                className="w-full border rounded-md p-2"
                value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value)}
              />

              <div className="flex gap-2">
                <button
                  onClick={handlePagar}
                  className="bg-[#0a1d37] text-white px-4 py-2 rounded-md hover:bg-blue-900"
                >
                  Pagar
                </button>
                <button
                  onClick={handleCancelar}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancelar carrito
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
