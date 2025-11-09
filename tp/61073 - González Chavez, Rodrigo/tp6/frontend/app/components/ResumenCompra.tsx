"use client"

import Image from "next/image"
import { useCarritoStore } from "../store/useCarritoStore"
import {Card, CardContent, CardHeader, CardTitle} from "../components/ui/card"

export default function ResumenCompra() {
    const {items} = useCarritoStore()
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    const subtotal = items.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0)
    const iva = items.reduce((acc, item) => acc + item.producto.precio * item.cantidad * (item.producto.categoria.toLowerCase() === "electronica" ? 0.1 : 0.21), 0)
    const envio = subtotal > 1000 ? 0 : 50
    const total = subtotal + iva + envio

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Resumen de tu compra
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.map((i) => (
                    <div key={i.producto.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12">
                                <Image
                                    src={`${API_URL}/imagenes/${i.producto.imagen}`}
                                    alt={i.producto.nombre}
                                    fill
                                    unoptimized
                                    className="object-contain rounded"
                                />
                            </div>
                            <div>
                                <p className="font-medium text-sm">{i.producto.nombre}</p>
                                <p className="text-xs text-gray-500">
                                    Cantidad: {i.cantidad} x {i.producto.precio.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <p className="font-semibold text-sm">
                            ${(i.producto.precio * i.cantidad).toFixed(2)}
                        </p>
                    </div>
                ))}
                <div className="text-sm mt-4 space-y-1">
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
            </CardContent>
        </Card>
    )
}