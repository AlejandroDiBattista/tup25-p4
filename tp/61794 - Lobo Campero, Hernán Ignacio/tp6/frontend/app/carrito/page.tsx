"use client";

import { useState, useEffect } from "react";
import { Carrito as CarritoType, Producto } from "@/app/types";
import { useAuth } from "@/app/context/AuthContext";
import {
  obtenerCarrito,
  eliminarDelCarrito,
  finalizarCompra,
  cancelarCarrito,
} from "@/app/services/carrito";
import { obtenerProductos } from "@/app/services/productos";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import Link from "next/link";

export default function CarritoPage() {
  const { token, isAutenticado } = useAuth();
  const [carrito, setCarrito] = useState<CarritoType | null>(null);
  const [productos, setProductos] = useState<{ [key: number]: Producto }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [isFinalizando, setIsFinalizando] = useState(false);

  useEffect(() => {
    if (!isAutenticado || !token) return;

    const cargarCarrito = async () => {
      try {
        setIsLoading(true);
        const carritoData = await obtenerCarrito(token);
        setCarrito(carritoData);

        // Cargar info de productos
        const productosData = await obtenerProductos();
        const productosMap: { [key: number]: Producto } = {};
        productosData.forEach((p) => {
          productosMap[p.id] = p;
        });
        setProductos(productosMap);
      } catch (err: any) {
        setError(err.message || "Error al cargar el carrito");
      } finally {
        setIsLoading(false);
      }
    };

    cargarCarrito();
  }, [isAutenticado, token]);

  const eliminarItem = async (itemId: number) => {
    if (!token) {
      setError("Sesión expirada. Por favor inicia sesión nuevamente.");
      return;
    }

    try {
      setError(null);
      const nuevoCarrito = await eliminarDelCarrito(token, itemId);
      setCarrito(nuevoCarrito);
    } catch (err: any) {
      const mensajeError = err.message || "Error al eliminar el producto";
      setError(mensajeError);
      console.error("Error al eliminar:", err);
    }
  };

  const calcularTotales = () => {
    if (!carrito || !carrito.items) return { subtotal: 0, iva: 0, envio: 0, total: 0 };

    let subtotal = 0;
    let iva = 0;

    carrito.items.forEach((item) => {
      const producto = productos[item.producto_id];
      subtotal += item.cantidad * item.precio_unitario;

      // Calcular IVA según categoría
      if (producto && producto.categoria.toLowerCase() === "electrónica") {
        iva += item.cantidad * item.precio_unitario * 0.1;
      } else {
        iva += item.cantidad * item.precio_unitario * 0.21;
      }
    });

    const envio = subtotal > 1000 ? 0 : 50;
    const total = subtotal + iva + envio;

    return { subtotal, iva, envio, total };
  };

  const handleCheckout = async () => {
    if (!token || !carrito) {
      setError("Sesión expirada. Por favor inicia sesión nuevamente.");
      return;
    }

    if (!direccion.trim()) {
      setError("Por favor ingresa una dirección de envío");
      return;
    }

    if (!tarjeta.trim()) {
      setError("Por favor ingresa el número de tarjeta");
      return;
    }

    if (tarjeta.length < 4) {
      setError("Por favor ingresa al menos los últimos 4 dígitos de la tarjeta");
      return;
    }

    try {
      setIsFinalizando(true);
      setError(null);
      await finalizarCompra(token, direccion, tarjeta);
      // Redirigir a compras o mostrar confirmación
      window.location.href = "/compras";
    } catch (err: any) {
      const mensajeError = err.message || "Error al finalizar la compra";
      setError(mensajeError);
      console.error("Error al finalizar compra:", err);
    } finally {
      setIsFinalizando(false);
    }
  };

  if (!isAutenticado) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertTitle>No autenticado</AlertTitle>
          <AlertDescription>
            Debes <Link href="/auth" className="underline font-bold">iniciar sesión</Link> para ver tu carrito.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return <div className="container mx-auto py-8">Cargando carrito...</div>;
  }

  if (error && !carrito) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!carrito || carrito.items.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Carrito vacío</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Tu carrito está vacío. Vuelve a la tienda para agregar productos.</p>
            <Link href="/">
              <Button>Volver a la tienda</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { subtotal, iva, envio, total } = calcularTotales();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mi Carrito</h1>

      {error && (
        <Alert className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Lista de items */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items en el carrito ({carrito.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {carrito.items.map((item) => {
                const producto = productos[item.producto_id];
                if (!producto) return null;

                return (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-bold">{producto.titulo}</h3>
                      <p className="text-sm text-gray-600">${item.precio_unitario.toFixed(2)}</p>
                      <p className="text-sm">Cantidad: {item.cantidad}</p>
                      <p className="text-sm font-semibold">
                        Subtotal: ${(item.cantidad * item.precio_unitario).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => eliminarItem(item.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Resumen de compra */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen de compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 border-b pb-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA:</span>
                  <span>${iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>${envio.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {!showCheckout ? (
                <Button className="w-full" onClick={() => setShowCheckout(true)}>
                  Proceder al pago
                </Button>
              ) : (
                <div className="space-y-3">
                  <Input
                    placeholder="Dirección de entrega"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                  <Input
                    placeholder="Número de tarjeta"
                    value={tarjeta}
                    onChange={(e) => setTarjeta(e.target.value)}
                  />
                  <Button
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isFinalizando}
                  >
                    {isFinalizando ? "Procesando..." : "Confirmar compra"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowCheckout(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
