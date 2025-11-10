'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { estaAutenticado, getAuthHeaders } from '../services/auth';

interface ItemCarrito {
  producto_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

export default function CarritoPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const cargarCarrito = async () => {
    try {
      const response = await fetch(`${API_URL}/carrito`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Error al cargar carrito');
      
      const data = await response.json();
      setItems(data.items || []);
    } catch {
      setMensaje('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!estaAutenticado()) {
      router.push('/auth');
      return;
    }
    cargarCarrito();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eliminarItem = async (productoId: number) => {
    try {
      const response = await fetch(`${API_URL}/carrito/quitar/${productoId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Error al eliminar');
      
      await cargarCarrito();
      setMensaje('Producto eliminado');
      setTimeout(() => setMensaje(''), 2000);
    } catch {
      setMensaje('Error al eliminar');
      setTimeout(() => setMensaje(''), 2000);
    }
  };

  const finalizarCompra = async () => {
    setProcesando(true);
    const totalCalculado = calcularTotal();
    try {
      const response = await fetch(`${API_URL}/carrito/finalizar`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          direccion: 'Dirección de envío',
          tarjeta: '****-****-****-1234'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error al finalizar compra');
      }

      const data = await response.json();
      alert(`¡Compra finalizada!\nTotal: $${totalCalculado.toFixed(2)}\nID Compra: ${data.compra_id}`);
      router.push('/compras');
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'Error al procesar');
      setTimeout(() => setMensaje(''), 3000);
    } finally {
      setProcesando(false);
    }
  };

  const vaciarCarrito = async () => {
    if (!confirm('¿Vaciar todo el carrito?')) return;
    
    try {
      const response = await fetch(`${API_URL}/carrito/cancelar`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Error al vaciar');
      
      await cargarCarrito();
      setMensaje('Carrito vaciado');
      setTimeout(() => setMensaje(''), 2000);
    } catch {
      setMensaje('Error al vaciar');
      setTimeout(() => setMensaje(''), 2000);
    }
  };

  const calcularSubtotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calcularIVA = () => {
    return calcularSubtotal() * 0.21;
  };

  const calcularEnvio = () => {
    return calcularSubtotal() > 5000 ? 0 : 500;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularIVA() + calcularEnvio();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando carrito...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Mi Carrito</h1>
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Seguir comprando
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {mensaje && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
            {mensaje}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-xl mb-4">Tu carrito está vacío</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Explorar productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Productos ({items.length})</h2>
                <button
                  onClick={vaciarCarrito}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Vaciar carrito
                </button>
              </div>

              {items.map((item) => (
                <div key={item.producto_id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Cantidad: {item.cantidad}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      ${item.precio.toFixed(2)} × {item.cantidad} = ${item.subtotal.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => eliminarItem(item.producto_id)}
                    className="text-red-600 hover:text-red-700 self-start"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Resumen de compra</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>${calcularSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>IVA (21%):</span>
                    <span>${calcularIVA().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Envío:</span>
                    <span>{calcularEnvio() === 0 ? 'GRATIS' : `$${calcularEnvio()}`}</span>
                  </div>
                  {calcularSubtotal() > 5000 && (
                    <p className="text-xs text-green-600">
                      ✓ Envío gratis por compras mayores a $5000
                    </p>
                  )}
                  <div className="border-t pt-3 flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">${calcularTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={finalizarCompra}
                  disabled={procesando}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  {procesando ? 'Procesando...' : 'Finalizar Compra'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
