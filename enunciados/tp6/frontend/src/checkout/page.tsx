'use client';

import { useCart } from '@/app/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    address: '',
    card: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const iva = subtotal * 0.21;
  const envio = cart.length > 0 ? 50 : 0;
  const total = subtotal + iva + envio;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.address || !formData.card || !formData.name) {
      alert('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      // Simular envío de pedido
      console.log('Procesando compra:', { formData, cart, total });

      // Guardar en localStorage
      const newOrder = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        total,
        status: 'Completada',
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      clearCart();
      setTimeout(() => {
        router.push('/success');
      }, 1000);
    } catch (err) {
      alert('Error al procesar la compra');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
          <Link href="/" className="text-blue-600 hover:underline font-semibold">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Finalizar compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumen del carrito */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Resumen del carrito</h2>
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (21%):</span>
                <span>${iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>${envio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Formulario de datos de envío */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Datos de envío</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Tu dirección"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Tarjeta</label>
                <input
                  type="text"
                  name="card"
                  value={formData.card}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-800 disabled:opacity-50 transition"
              >
                {loading ? 'Procesando...' : 'Confirmar compra'}
              </button>

              <Link href="/cart" className="block w-full text-center py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
                Volver al carrito
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}