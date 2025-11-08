"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function Carrito() {
    const { cart, loading, error, removeFromCart, increaseQuantity, decreaseQuantity, cancelCart } = useCart();
    const router = useRouter();

    if (loading) {
        return (
            <div className="border rounded-lg p-4 mt-16 text-center bg-white shadow">
                <p>Cargando carrito...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border rounded-lg p-4 mt-16 text-center bg-red-100 text-red-800">
                <p>Error al cargar el carrito: {error}</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="border rounded-lg p-4 mt-16 text-center bg-white shadow">
                <h2 className="text-xl font-semibold mb-4 text-black">Carrito de Compras</h2>
                <p className="text-gray-600">Tu carrito está vacío.</p>
            </div>
        );
    }

    return (
        <div className="border rounded-lg p-4 mt-16 bg-white shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Carrito de Compras</h2>

            <div className="space-y-4 mb-6">
                {cart.items.map(item => (
                    <div key={item.producto.id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="font-semibold text-sm text-black">{item.producto.titulo}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <button onClick={() => decreaseQuantity(item.producto.id)} className="bg-gray-200 w-6 h-6 rounded-full font-bold text-black">-</button>
                                    <span className="text-sm font-medium text-black">{item.cantidad}</span>
                                    <button 
                                        onClick={() => increaseQuantity(item.producto.id)} 
                                        className="bg-gray-200 w-6 h-6 rounded-full font-bold text-black disabled:bg-gray-100 disabled:text-gray-400"
                                        disabled={item.producto.existencia === 0}
                                    >+</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="font-semibold text-sm text-black">${(item.producto.precio * item.cantidad).toFixed(2)}</p>
                            <button 
                                onClick={() => removeFromCart(item.producto.id)} 
                                className="text-red-500 hover:text-red-700 text-lg font-bold"
                                title="Eliminar producto">
                                &times;
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                <div className="flex justify-between"><span>Subtotal:</span> <span className="font-medium text-black">${cart.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>IVA:</span> <span className="font-medium text-black">${cart.iva.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Envío:</span> <span className="font-medium text-black">${cart.costo_envio.toFixed(2)}</span></div>
                <div className="flex justify-between text-lg font-bold text-black mt-2"><span>Total:</span> <span>${cart.total.toFixed(2)}</span></div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <button onClick={() => router.push('/checkout')} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Continuar compra
                </button>
                <button onClick={cancelCart} className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">
                    Vaciar Carrito
                </button>
            </div>
        </div>
    );
}
