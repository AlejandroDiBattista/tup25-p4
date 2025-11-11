"use client";

import { useState, useEffect } from "react";
import { Compra, Producto } from "@/app/types";
import { useAuth } from "@/app/context/AuthContext";
import { obtenerCompras } from "@/app/services/compras";
import { obtenerProductos } from "@/app/services/productos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function ComprasPage() {
  const { token, isAutenticado } = useAuth();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [productos, setProductos] = useState<{ [key: number]: Producto }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompra, setSelectedCompra] = useState<number | null>(null);

  useEffect(() => {
    if (!isAutenticado || !token) return;

    const cargarDatos = async () => {
      try {
        setIsLoading(true);
        const comprasData = await obtenerCompras(token);
        setCompras(comprasData);

        // Cargar info de productos
        const productosData = await obtenerProductos();
        const productosMap: { [key: number]: Producto } = {};
        productosData.forEach((p) => {
          productosMap[p.id] = p;
        });
        setProductos(productosMap);
      } catch (err: any) {
        setError(err.message || "Error al cargar compras");
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, [isAutenticado, token]);

  if (!isAutenticado) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertTitle>No autenticado</AlertTitle>
          <AlertDescription>
            Debes <Link href="/auth" className="underline font-bold">iniciar sesión</Link> para ver tus compras.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return <div className="container mx-auto py-8">Cargando compras...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (compras.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>No hay compras</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Aún no tienes compras registradas.</p>
            <Link href="/">
              <Button>Ir a la tienda</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const compraSeleccionada = selectedCompra
    ? compras.find((c) => c.id === selectedCompra)
    : null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mis Compras</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Lista de compras */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Historial ({compras.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {compras.map((compra) => (
                <div
                  key={compra.id}
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    selectedCompra === compra.id ? "bg-blue-50 border-blue-500" : ""
                  }`}
                  onClick={() => setSelectedCompra(compra.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">Compra #{compra.id}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(compra.fecha).toLocaleDateString("es-AR")}
                      </p>
                      <p className="text-sm">{compra.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${compra.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Total</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Detalles de compra */}
        {compraSeleccionada && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Detalles - Compra #{compraSeleccionada.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 border-b pb-3">
                  <div className="text-sm">
                    <p className="font-semibold">Fecha:</p>
                    <p>{new Date(compraSeleccionada.fecha).toLocaleDateString("es-AR")}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">Dirección:</p>
                    <p>{compraSeleccionada.direccion}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">Tarjeta:</p>
                    <p>****{compraSeleccionada.tarjeta_ultimos_digitos}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold">Items:</h4>
                  {compraSeleccionada.items.map((item) => (
                    <div key={item.id} className="text-sm p-2 bg-gray-50 rounded">
                      <p className="font-semibold">{item.nombre}</p>
                      <p>
                        {item.cantidad} x ${item.precio_unitario.toFixed(2)} = $
                        {(item.cantidad * item.precio_unitario).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>IVA:</span>
                    <span>${compraSeleccionada.iva.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío:</span>
                    <span>${compraSeleccionada.envio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${compraSeleccionada.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
