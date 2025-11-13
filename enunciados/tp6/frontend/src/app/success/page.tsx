'use client';

import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-4xl font-bold mb-4">¡Compra confirmada!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Gracias por tu compra. Recibirás un email de confirmación en breve.
        </p>

        <div className="space-y-4">
          <Link
            href="/history"
            className="block w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Ver mis compras
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-300 text-black py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
          >
            Volver a comprar
          </Link>
        </div>
      </div>
    </div>
  );
}
