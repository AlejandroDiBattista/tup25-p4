"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ItemCarrito from "./ItemCarrrito";
import { CarritoRead, Producto } from "../types";
import React, { useEffect, useState } from "react";
import { verCarrito } from "../services/Carrito";
import { useRouter } from 'next/navigation';


interface CarritoProps {
    CarritoData: CarritoRead[];
    setCarritoData: React.Dispatch<React.SetStateAction<CarritoRead[]>>;
    setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
}

export default function Carrito({ CarritoData, setCarritoData, setProductos }: CarritoProps) {

    const router = useRouter();

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
                if (res)
                    setCarritoData(res);

            } catch (error) {
                console.error('Error al cargar el carrito:', error);
            }
        }
        if (token)
            fetchCarrito(token);

    }, []);

    const actualizarCantidad = (idProducto: number, nuevaCantidad: number) => {
        const copia = CarritoData.map(item => {
            if (item.producto.id === idProducto) {
                const diferencia = nuevaCantidad - item.cantidad;
                const nuevaExistencia = item.producto.existencia - diferencia;

                return {
                    ...item,
                    cantidad: nuevaCantidad,
                    producto: {
                        ...item.producto,
                        existencia: nuevaExistencia >= 0 ? nuevaExistencia : 0,
                        agotado: nuevaExistencia <= 0
                    }
                };
            }
            return item;
        })

        setCarritoData(copia);
        actualizarExitenciaHome(idProducto, nuevaCantidad, copia)
    };

    const actualizarExitenciaHome = (idProducto: number, nuevaCantidad: number, copia: CarritoRead[]) => {
        setProductos(prev =>
            prev.map(p => {
                const itemCarrito = copia.find(item => item.producto.id === idProducto);
                if (p.id === idProducto && itemCarrito) {
                    return {
                        ...p,
                        existencia: itemCarrito?.producto.existencia
                    };
                }
                return p;
            })
        );
    }

    const ContinuarCompra = () => {
        router.push('/confirmar-compra');
    }


    return (

        <Card className="p-4 sticky top-4">
            {!token ? (
                <h2 className="mx-auto ">Inicie Sesion</h2>
            ) :

                (<CardContent className="p-0">


                    < div className="space-y-4" >
                        {
                            (CarritoData).map(item => (
                                <ItemCarrito key={item.producto.id}
                                    item={item.producto as Producto}
                                    precioTotal={item.producto.precio * item.cantidad}
                                    token={token!}
                                    onActualizarCantidad={actualizarCantidad}
                                    cantidad={item.cantidad}

                                />
                            ))
                        }
                    </div >


                    < hr className="my-4" />


                    < div className="space-y-2 text-sm" >

                        < div className="flex justify-between" >
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div >

                        < div className="flex justify-between" >
                            <span>IVA</span>
                            <span>${iva.toFixed(2)}</span>
                        </div >

                        < div className="flex justify-between" >
                            <span>Envío</span>
                            <span>${envio.toFixed(2)}</span>
                        </div >

                        < div className="flex justify-between font-bold border-t pt-2 mt-2" >
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div >
                    </div >


                    < hr className="my-4" />


                    < div className="flex space-x-2 flex-wrap " >
                        <Button variant="outline" className="flex-1 mt-2">
                            ❌ Cancelar
                        </Button>
                        <Button
                            className="flex-1 bg-black text-white hover:bg-gray-800 mt-2"
                            onClick={ContinuarCompra}
                        >
                            Continuar compra
                        </Button>
                    </div >
                </CardContent >)}

        </Card >

    );
}