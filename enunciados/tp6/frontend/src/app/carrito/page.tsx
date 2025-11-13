'use client';

import { useCart } from '@/app/context/CartContext';
import CarritoItem from '@/components/CarritoItem';
import { ProductList } from '@/components/Productlist';
import Link from 'next/link';

export default function CarritoPage() {
  const { cart, clearCart } = useCart();

  const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  const iva = +(subtotal * 0.21).toFixed(2);
  const envio = cart.length > 0 ? 50 : 0;
  const total = +(subtotal + iva + envio).toFixed(2);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductList />
        </div>

        <aside className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Resumen del carrito</h2>

          {cart.length === 0 ? (
            <div className="text-gray-600">Tu carrito está vacío.</div>
          ) : (
            <div>
              <div className="space-y-2 max-h-64 overflow-auto">
                {cart.map((it) => (
                  <CarritoItem
                    key={it.id}
                    item={{ id: it.id, name: it.name, price: it.price, image: it.image, quantity: it.quantity }}
                  />
                ))}
              </div>

              <div className="border-t mt-4 pt-4 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA</span>
                  <span>${iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>${envio.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-bold text-lg mt-3">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={clearCart}
                    className="flex-1 py-2 border rounded-md"
                  >
                    Cancelar
                  </button>

                  <Link href="/checkout" className="flex-1 py-2 bg-black text-white rounded-md text-center">
                    Continuar compra
                  </Link>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}