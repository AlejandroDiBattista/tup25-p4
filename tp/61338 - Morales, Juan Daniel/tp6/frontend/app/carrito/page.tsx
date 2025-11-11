"use client";
import { useEffect, useState } from "react";
import { Carrito } from "../services/productos";

interface ItemCarrito {
  producto_id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface CarritoData {
  carrito_id: number;
  estado: string;
  items: ItemCarrito[];
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
}

export default function CarritoPage() {
  const [data, setData] = useState<CarritoData | null>(null);
  const [direccion, setDireccion] = useState("");
  const [tarjeta, setTarjeta] = useState("");

  const load = async () => {
    const info = await Carrito.ver();
    setData(info);
  };

  useEffect(() => {
  (async () => {
    await load();
  })();
}, []);

  const quitar = async (id: number) => {
    await Carrito.quitar(id);
    await load();
  };

  const cancelar = async () => {
    await Carrito.cancelar();
    await load();
  };

  const finalizar = async () => {
    if (!direccion || !tarjeta) {
      alert("Completá dirección y tarjeta");
      return;
    }
    try {
      const r = await Carrito.finalizar(direccion, tarjeta);
      alert(`Compra realizada ✅\nID: ${r.compra_id}\nTotal: $${r.total}`);
      await load();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Error al finalizar compra";
      alert(msg);
    }
  };

  if (!data) return <div className="card">Cargando carrito...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Carrito</h1>

      <div className="space-y-2">
        {data.items.length === 0 ? (
          <div className="card text-gray-600">El carrito está vacío</div>
        ) : (
          data.items.map((it) => (
            <div key={it.producto_id} className="card flex justify-between">
              <div>
                <div className="font-semibold">{it.nombre}</div>
                <div>
                  Cant: {it.cantidad} · ${it.precio_unitario.toFixed(2)}
                </div>
              </div>
              <button className="btn" onClick={() => quitar(it.producto_id)}>
                Quitar
              </button>
            </div>
          ))
        )}
      </div>

      <div className="card space-y-1">
        <div>Subtotal: ${data.subtotal.toFixed(2)}</div>
        <div>IVA: ${data.iva.toFixed(2)}</div>
        <div>Envío: ${data.envio.toFixed(2)}</div>
        <div className="font-bold">Total: ${data.total.toFixed(2)}</div>
      </div>

      <div className="card space-y-2">
        <h2 className="font-semibold">Finalizar compra</h2>
        <input
          className="input"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <input
          className="input"
          placeholder="Tarjeta (16 dígitos)"
          value={tarjeta}
          onChange={(e) => setTarjeta(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="btn" onClick={finalizar}>
            Pagar
          </button>
          <button className="btn" onClick={cancelar}>
            Cancelar carrito
          </button>
        </div>
      </div>
    </div>
  );
}
