'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrders, getOrderById } from '@/api';

interface ItemCompra {
  producto_id: number;
  cantidad: number;
  nombre: string;
  precio_unitario: number;
}

interface Compra {
  id: number;
  fecha: string;
  direccion: string;
  tarjeta: string;
  total: number;
  envio: number;
  items: ItemCompra[];
}

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [compraSeleccionada, setCompraSeleccionada] = useState<Compra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarCompras();
  }, []);

  const cargarCompras = async () => {
    try {
      const data = await getOrders();
      setCompras(data);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar las compras');
      setLoading(false);
    }
  };

  const verDetalle = async (compraId: number) => {
    try {
      const data = await getOrderById(compraId);
      setCompraSeleccionada(data);
    } catch (error) {
      alert('Error al cargar el detalle de la compra');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (compras.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No tienes compras realizadas</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Historial de compras</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {compras.map((compra) => (
            <div
              key={compra.id}
              className="border rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-50"
              onClick={() => verDetalle(compra.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Compra #{compra.id}</h3>
                  <p className="text-gray-600">
                    Fecha: {new Date(compra.fecha).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-bold">${compra.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {compraSeleccionada && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              Detalle de compra #{compraSeleccionada.id}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">
                  Fecha: {new Date(compraSeleccionada.fecha).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Dirección: {compraSeleccionada.direccion}
                </p>
                <p className="text-gray-600">
                  Tarjeta: ****-****-****-
                  {compraSeleccionada.tarjeta.slice(-4)}
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Productos</h4>
                {compraSeleccionada.items.map((item) => (
                  <div
                    key={item.producto_id}
                    className="flex justify-between py-2"
                  >
                    <div>
                      <p className="font-medium">{item.nombre}</p>
                      <p className="text-sm text-gray-600">
                        {item.cantidad} x ${item.precio_unitario.toFixed(2)}
                      </p>
                    </div>
                    <span>
                      ${(item.cantidad * item.precio_unitario).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>${compraSeleccionada.envio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>Total</span>
                  <span>${compraSeleccionada.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}