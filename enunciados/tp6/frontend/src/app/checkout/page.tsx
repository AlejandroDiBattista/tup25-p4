'use client'; 

import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() { 
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    numeroTarjeta: '',
    mesVencimiento: '',
    anioVencimiento: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false); 
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }; 

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    setLoading(true);

    // Guardar orden en localStorage
    const orden = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      items: cart,
      total,
      cliente: form,
    };

    const ordenes = JSON.parse(localStorage.getItem('ordenes') || '[]');
    ordenes.push(orden);
    localStorage.setItem('ordenes', JSON.stringify(ordenes));

    // Limpiar carrito
    clearCart();

    setLoading(false);
    router.push('/success');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Carrito vacío</h1>
          <p className="text-gray-600 mb-6">No hay productos para comprar</p>
          <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
            Volver a comprar
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = total - (total * 0.21) - 50;
  const iva = total * 0.21;
  const envio = 50;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Información de entrega</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección"
                  value={form.direccion}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                  type="text"
                  name="ciudad"
                  placeholder="Ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  name="codigoPostal"
                  placeholder="Código postal"
                  value={form.codigoPostal}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <h2 className="text-xl font-bold mb-4 mt-6">Información de pago</h2>

              <input
                type="text"
                name="numeroTarjeta"
                placeholder="Número de tarjeta"
                value={form.numeroTarjeta}
                onChange={handleChange}
                required
                maxLength={19}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-4"
              />

              <div className="grid grid-cols-3 gap-4 mb-6">
                <input
                  type="text"
                  name="mesVencimiento"
                  placeholder="MM"
                  value={form.mesVencimiento}
                  onChange={handleChange}
                  required
                  maxLength={2}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  name="anioVencimiento"
                  placeholder="AA"
                  value={form.anioVencimiento}
                  onChange={handleChange}
                  required
                  maxLength={2}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={form.cvv}
                  onChange={handleChange}
                  required
                  maxLength={3}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 transition"
              >
                {loading ? 'Procesando...' : 'Confirmar compra'}
              </button>
            </form>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <h2 className="text-xl font-bold mb-4">Resumen</h2>

              <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
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
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
