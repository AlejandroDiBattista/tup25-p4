'use client';
import React from 'react';
import Link from 'next/link';
import useCartStore from '../store/cart';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
    const { items, removeItem, updateQuantity, getTotals, itemCount } = useCartStore();
    const totals = getTotals();

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />
            
            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">
                        🛒 Carrito ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Items del carrito */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-4xl mb-4">🛒</p>
                            <p className="text-lg">Tu carrito está vacío</p>
                            <p className="text-sm mt-2">Agrega productos para empezar</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 border-b pb-4">
                                    {/* Imagen del producto */}
                                    <img
                                        src={item.imagen}
                                        alt={item.nombre || item.titulo}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    
                                    {/* Detalles */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm mb-1">
                                            {item.nombre || item.titulo}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            ${item.precio.toFixed(2)}
                                        </p>
                                        
                                        {/* Controles de cantidad */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.cantidad - 1))}
                                                className="w-7 h-7 border rounded hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center">{item.cantidad}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                                className="w-7 h-7 border rounded hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="ml-auto text-red-500 text-sm hover:text-red-700"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Total del item */}
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            ${(item.precio * item.cantidad).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer con totales */}
                {items.length > 0 && (
                    <div className="border-t p-4 bg-gray-50">
                        {/* Desglose de costos */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>${totals.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>IVA:</span>
                                <span>${totals.iva.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Envío:</span>
                                <span>
                                    {totals.envio === 0 ? (
                                        <span className="text-green-600">¡Gratis!</span>
                                    ) : (
                                        `$${totals.envio.toFixed(2)}`
                                    )}
                                </span>
                            </div>
                            {totals.subtotal < 1000 && totals.subtotal > 0 && (
                                <p className="text-xs text-gray-600">
                                    💡 Agrega ${(1000 - totals.subtotal).toFixed(2)} más para envío gratis
                                </p>
                            )}
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total:</span>
                                <span>${totals.total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="space-y-2">
                            <Link
                                href="/finalizar-compra"
                                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700"
                                onClick={onClose}
                            >
                                Finalizar Compra
                            </Link>
                            <button
                                onClick={onClose}
                                className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
