"use client";

import { Producto } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from 'next/image';

interface ProductoCardProps {
    producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const router = useRouter();

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        try {
            await addToCart(producto.id, 1);
            // Opcional: mostrar una notificación de éxito
        } catch (error: any) {
            console.error("Error al agregar al carrito:", error.message);
            // Opcional: mostrar una notificación de error
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col text-black">
            <div className="relative w-full h-48 mb-4">
                <Image 
                    src={producto.imagen} 
                    alt={producto.titulo} 
                    layout="fill" 
                    objectFit="contain"
                    className="rounded-t-lg"
                />
            </div>
            <h2 className="text-lg font-bold flex-grow">{producto.titulo}</h2>
            <p className="text-sm text-gray-500 mb-2">{producto.categoria}</p>
            <div className="flex justify-between items-center mt-4">
                <p className="text-xl font-semibold">${producto.precio.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Stock: {producto.existencia}</p>
            </div>
            <button 
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                disabled={producto.existencia === 0}
                onClick={handleAddToCart}
            >
                {producto.existencia > 0 ? 'Agregar al carrito' : 'Agotado'}
            </button>
        </div>
    );
}
