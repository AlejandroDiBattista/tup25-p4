"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { CarritoRead } from '@/types';
import { getCarrito, agregarAlCarrito, quitarDelCarrito, cancelarCompra } from '@/services/api';

interface CartContextType {
    cart: CarritoRead | null;
    loading: boolean;
    error: string | null;
    fetchCart: () => void;
    addToCart: (productoId: number, cantidad: number) => Promise<void>;
    removeFromCart: (productoId: number) => Promise<void>;
    increaseQuantity: (productoId: number) => Promise<void>;
    decreaseQuantity: (productoId: number) => Promise<void>;
    cancelCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState<CarritoRead | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (isAuthenticated && token) {
            setLoading(true);
            setError(null);
            try {
                const cartData = await getCarrito(token);
                setCart(cartData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            setCart(null);
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleCartAction = async (action: Promise<any>) => {
        try {
            await action;
            await fetchCart(); // Refrescar el carrito después de cualquier acción
        } catch (err: any) {
            setError(err.message);
            console.error("Error en la acción del carrito:", err.message);
            throw err;
        }
    };

    const addToCart = (productoId: number, cantidad: number) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No autenticado");
        return handleCartAction(agregarAlCarrito({ producto_id: productoId, cantidad }, token));
    };
    
    const removeFromCart = (productoId: number) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No autenticado");
        return handleCartAction(quitarDelCarrito(productoId, token));
    };
    
    const cancelCart = () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No autenticado");
        return handleCartAction(cancelarCompra(token));
    };
    
    const increaseQuantity = (productoId: number) => addToCart(productoId, 1);

    const decreaseQuantity = (productoId: number) => {
        const item = cart?.items.find(i => i.producto.id === productoId);
        if (item && item.cantidad > 1) {
            return addToCart(productoId, -1);
        } else {
            return removeFromCart(productoId);
        }
    };

    return (
        <CartContext.Provider value={{ cart, loading, error, fetchCart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, cancelCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
}
