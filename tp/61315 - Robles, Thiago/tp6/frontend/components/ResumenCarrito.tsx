"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {calcularTotales,useCarritoStore} from "@/store/useCarritoStore";


export default function ResumenCarrito() {

  const { articulos } = useCarritoStore();
  const { subtotal, iva, envio, total } = calcularTotales(articulos);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del carrito</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="space-y-4">
          {articulos.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <div>
                <p className="font-semibold text-base text-foreground">
                  {item.nombre}
                </p>
                <p className="text-muted-foreground">
                  Cantidad: {item.cantidad}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-base text-foreground">
                  ${(item.precio * item.cantidad).toFixed(2)}
                </p>
                <p className="text-muted-foreground">
                  IVA: $
                  {(
                    item.precio *
                    item.cantidad *
                    (item.categoria === "Electronica" ? 0.1 : 0.21)
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Total productos:</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>IVA:</span>
            <span className="font-semibold">${iva.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío:</span>
            <span className="font-semibold">${envio.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-base font-semibold">
          <span>Total a pagar:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
