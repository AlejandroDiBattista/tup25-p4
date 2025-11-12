'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: number;
  fecha: string;
  items: OrderItem[];
  total: number;
  cliente: {
    nombre: string;
    email: string;
    direccion: string;
    ciudad: string;
  };
}

export default function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const savedOrders = localStorage.getItem('ordenes');
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch (e) {
          console.error('Error al cargar órdenes:', e);
        }
      }
    } else {
      // Si no está autenticado, limpiar las órdenes
      setOrders([]);
    }
    setIsHydrated(true);
  }, [isAuthenticated]);

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Historial de compras</h1>
          <p className="text-gray-600 mb-6">Para ver tu historial de compras, debes iniciar sesión primero.</p>
          <Link href="/login" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition inline-block mb-3">
            Iniciar sesión
          </Link>
          <p className="text-gray-500 text-sm">¿No tienes cuenta? <Link href="/register" className="text-black font-semibold hover:underline">Regístrate aquí</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8">Historial de compras</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg mb-4">No tienes compras registradas aún.</p>
          <Link href="/" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
            Ir a comprar
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-lg">Orden #{order.id}</p>
                  <p className="text-gray-500 text-sm">{order.fecha}</p>
                  <p className="text-sm text-gray-600 mt-1">Cliente: {order.cliente.nombre}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                  <p className="text-sm font-semibold text-green-600">Completada</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Artículos:</p>
                <ul className="text-sm space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="text-gray-600">
                      {item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-600">
                  <strong>Dirección de entrega:</strong> {order.cliente.direccion}, {order.cliente.ciudad}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
