"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ItemCarrito from "./ItemCarrrito";
import { CarritoRead } from "../types";
import React, { useEffect, useState } from "react";
import { verCarrito } from "../services/Carrito";


interface CarritoProps {
    CarritoData: CarritoRead[];
    setCarritoData: React.Dispatch<React.SetStateAction<CarritoRead[]>>;
}

export default function Carrito({ CarritoData, setCarritoData }: CarritoProps) {
    // Lógica para calcular totales (ejemplo simple)

    const token = localStorage.getItem("token");
    const subtotal = CarritoData.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
    const iva = CarritoData.reduce((acc, item) => {
        const precioTotalItem = item.producto.precio * item.cantidad;
        const porcentajeIVA = item.producto.categoria === "electrónica" ? 0.10 : 0.21;
        return acc + precioTotalItem * porcentajeIVA;
    }, 0);

    const envio = subtotal > 1000 ? 0 : 50;
    const total = subtotal + iva + envio;


    useEffect(() => {


        const fetchCarrito = async (token: string) => {
            try {
                const res = await verCarrito(token);
                if (res) {
                    setCarritoData(res);
                }
            } catch (error) {
                console.error('Error al cargar el carrito:', error);
            }
        }
        if (token)
            fetchCarrito(token);

    }, []);

    const actualizarCantidad = (idProducto: number, nuevaCantidad: number) => {
        setCarritoData(prev =>
            prev.map(item =>
                item.producto.id === idProducto
                    ? { ...item, cantidad: nuevaCantidad }
                    : item
            )
        );
    };


    return (

        <Card className="p-4 sticky top-4">
            {!token ? (
                <h2 className="mx-auto ">Inicie Sesion</h2>
            ) :

                (<CardContent className="p-0">

                    {/* 1. Contenedor de Items del Carrito */}
                    < div className="space-y-4" >
                        {
                            (CarritoData).map(item => (
                                <ItemCarrito key={item.producto.id}
                                    item={item.producto}
                                    precioTotal={item.producto.precio * item.cantidad}
                                    token={token!}
                                    onActualizarCantidad={actualizarCantidad}
                                />
                            ))
                        }
                    </div >

                    {/* Separador */}
                    < hr className="my-4" />

                    {/* 2. Resumen de Totales */}
                    < div className="space-y-2 text-sm" >
                        {/* Fila Subtotal */}
                        < div className="flex justify-between" >
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div >
                        {/* Fila IVA */}
                        < div className="flex justify-between" >
                            <span>IVA</span>
                            <span>${iva.toFixed(2)}</span>
                        </div >
                        {/* Fila Envío */}
                        < div className="flex justify-between" >
                            <span>Envío</span>
                            <span>${envio.toFixed(2)}</span>
                        </div >
                        {/* Fila Total */}
                        < div className="flex justify-between font-bold border-t pt-2 mt-2" >
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div >
                    </div >

                    {/* Separador */}
                    < hr className="my-4" />

                    {/* 3. Botones Finales */}
                    < div className="flex space-x-2" >
                        <Button variant="outline" className="flex-1">
                            ❌ Cancelar
                        </Button>
                        <Button className="flex-1 bg-black text-white hover:bg-gray-800">
                            Continuar compra
                        </Button>
                    </div >
                </CardContent >)}

        </Card >

    );
}