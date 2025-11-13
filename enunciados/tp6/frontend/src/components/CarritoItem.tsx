'use client';

import { useCart } from '@/app/context/CartContext';

interface Item {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CarritoItem({ item }: { item: Item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const imageUrl = item.image 
    ? (item.image.startsWith('http') ? item.image : `/productos/${item.image}`)
    : '/placeholder.png';

  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between gap-4">
      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.png';
          }}
        />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-gray-500">Cantidad: {item.quantity}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          −
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          +
        </button>
      </div>

      <div className="text-right min-w-24">
        <p className="text-sm text-gray-500">Precio unitario</p>
        <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
      </div>

      <div className="text-right min-w-24">
        <p className="text-sm text-gray-500">Subtotal</p>
        <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
      </div>

      <button
        onClick={() => removeFromCart(item.id)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition ml-4 flex-shrink-0"
      >
        Eliminar
      </button>
    </div>
  );
}