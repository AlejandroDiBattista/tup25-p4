'use client';

import { useCart } from '@/app/context/CartContext';
import CarritoItem from '@/components/CarritoItem';
import Link from 'next/link';

export default function CartPage() {
  const { cart, clearCart } = useCart();

  const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  const iva = +(subtotal * 0.21).toFixed(2);
  const envio = cart.length > 0 ? 50 : 0;
  const total = +(subtotal + iva + envio).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Tu carrito</h1>

        {cart.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
            <Link href="/" className="text-blue-600 hover:underline font-semibold">
              Volver a productos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((it) => (
              <CarritoItem
                key={it.id}
                item={{ id: it.id, name: it.name, price: it.price, image: it.image, quantity: it.quantity }}
              />
            ))}

            <div className="bg-white p-6 rounded-lg shadow mt-8">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal productos:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 border-b pb-4">
                <span className="text-gray-600">IVA (21%):</span>
                <span className="font-semibold">${iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b">
                <span className="text-gray-600">Envío:</span>
                <span className="font-semibold">${envio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">Total a pagar:</span>
                <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
              </div>

              <div className="flex gap-4 mt-6">
                <Link
                  href="/"
                  className="flex-1 bg-gray-300 text-black py-3 rounded-lg font-semibold hover:bg-gray-400 transition text-center"
                >
                  Seguir comprando
                </Link>
                <button
                  onClick={clearCart}
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Vaciar carrito
                </button>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-center mt-2"
              >
                Continuar compra
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}