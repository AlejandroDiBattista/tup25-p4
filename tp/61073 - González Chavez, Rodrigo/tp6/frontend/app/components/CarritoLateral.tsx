"use client"

import { useCarritoStore } from "../store/useCarritoStore"
import { useAuthStore } from "../store/useAuthStore"
import { procesarCarrito } from "../services/carrito"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CarritoLateral() {
    const {items, agregar, disminuir, eliminar, vaciar} = useCarritoStore()
    const {token} = useAuthStore()
    const router = useRouter()
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    const handleFinalizarCarrito = async () => {
        if (!token) {
            toast.error("Debes iniciar sesión para finalizar la compra")
            router.push("/login")
            return
        }

        try {
            await procesarCarrito(token)
            toast.success("Compra realizada con éxito")
            vaciar()
        } catch {
            toast.error("Ocurrió un error al procesar la compra")
        }
    }

    const subtotal = items.reduce(
        (acc, item) => acc + item.producto.precio * item.cantidad, 0
    )
    const iva = items.reduce((acc, item) => {
        const catElectro = item.producto.categoria?.toLowerCase() === "electronica"
        const porcentaje = catElectro ? 0.1 : 0.21
        return acc + item.producto.precio * item.cantidad * porcentaje
    }, 0)
    const envio = subtotal + iva >= 1000 ? 0 : items.length > 0 ? 50 : 0
    const total = subtotal + iva + envio

    return (
        <aside className="bg-white border rounded-lg shadow-sm p-4 min-w-[320px] h-fit sticky top-24">
            {items.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">
                    Inicia sesión para ver y editar tu carrito.
                </p>
            ) : (
                <>
                    <div className="space-y-4">
                        {items.map((i) => (
                            <div key={i.producto.id} className="flex items-center gap-3 border-b pb-2">
                                <div className="relative w-12 h-12">
                                    <Image
                                        src={`${API_URL}/imagenes/${i.producto.imagen}`}
                                        alt={i.producto.nombre}
                                        fill
                                        unoptimized
                                        className="object-contain p-1"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium truncate">
                                        {i.producto.nombre}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        ${i.producto.precio.toFixed(2)}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => disminuir(i.producto.id)}
                                        >
                                            -
                                        </Button>
                                        <span>{i.cantidad}</span>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => agregar(i.producto)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold">
                                    ${(i.producto.precio * i.cantidad).toFixed(2)}
                                </p>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => eliminar(i.producto.id)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Eliminar producto"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
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
                        <div className="flex justify-between font-semibold border-t pt-2">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <Button variant="outline" onClick={vaciar}>
                            Cancelar
                        </Button>
                        <Button 
                            className="bg-gray-800 hover:bg-gray-950"
                            onClick={handleFinalizarCarrito}
                            disabled={items.length === 0}                                                   
                        >
                            Continuar compra
                        </Button>
                    </div>
                </>
            )}
        </aside>
    )
}