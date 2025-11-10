"use client";
import React, { useEffect, useState } from "react";
import CarritoItem from "../components/CarritoItem";
import { Producto } from "../types";
import { useRouter } from "next/navigation";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

interface CarritoProducto {
  id: number;
  cantidad: number;
}

export default function CompraPage() {
  const [carrito, setCarrito] = useState<CarritoProducto[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [direccion, setDireccion] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [confirmacion, setConfirmacion] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Cargar productos
    fetch("http://localhost:8000/productos")
      .then(res => res.json())
      .then(setProductos);
    // Preferir carrito del backend si hay token; caso contrario usar localStorage
    const token = localStorage.getItem("token");
    (async () => {
      try {
        if (token) {
          const res = await fetch("http://localhost:8000/carrito", { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            type ApiItem = { id: number; cantidad: number };
            const list: CarritoProducto[] = (data.productos || []).map((p: ApiItem) => ({ id: p.id, cantidad: p.cantidad }));
            localStorage.setItem("carrito", JSON.stringify(list));
            setCarrito(list);
            return;
          }
        }
      } catch {}
      const carritoLS = JSON.parse(localStorage.getItem("carrito") || "[]");
      setCarrito(carritoLS);
    })();
  }, []);

  const handleRemove = async (id: number) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch(`http://localhost:8000/carrito/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        const res = await fetch("http://localhost:8000/carrito", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          type ApiItem = { id: number; cantidad: number };
          const list: CarritoProducto[] = (data.productos || []).map((p: ApiItem) => ({ id: p.id, cantidad: p.cantidad }));
          localStorage.setItem("carrito", JSON.stringify(list));
          if (typeof window !== "undefined") window.dispatchEvent(new Event("carrito:changed"));
          setCarrito(list);
          return;
        }
      } catch {}
    }
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    if (typeof window !== "undefined") window.dispatchEvent(new Event("carrito:changed"));
  };

  const handleFinalizar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Debes iniciar sesión para comprar.");
      const res = await fetch("http://localhost:8000/carrito/finalizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ direccion, tarjeta }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.mensaje || "Error al finalizar compra");
      setConfirmacion(`Compra realizada con éxito. Total: $${data.total}`);
      setCarrito([]);
      localStorage.setItem("carrito", "[]");
      setTimeout(() => router.push("/compras"), 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    }
  };

  const productosEnCarrito = carrito.map(item => {
    const prod = productos.find(p => p.id === item.id);
    return prod ? { ...prod, cantidad: item.cantidad } : null;
  }).filter(Boolean) as (Producto & { cantidad: number })[];

  const total = productosEnCarrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Finalizar compra</h2>
      {productosEnCarrito.length === 0 ? (
        <div className="text-center text-gray-900">El carrito está vacío.</div>
      ) : confirmacion ? (
        <div className="text-green-600 text-center font-semibold mb-4">{confirmacion}</div>
      ) : (
        <>
          <div className="mb-6">
            {productosEnCarrito.map(p => (
              <CarritoItem key={p.id} producto={p} cantidad={p.cantidad} onRemove={() => handleRemove(p.id)} />
            ))}
          </div>
          <div className="mb-4 text-right font-bold">Total: ${total.toFixed(2)}</div>
          <form onSubmit={handleFinalizar} className="space-y-4">
            <Input
              type="text"
              placeholder="Dirección de envío"
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              required
            />
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Tarjeta de crédito"
              value={tarjeta}
              maxLength={19}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                const parts = digits.match(/.{1,4}/g) || [];
                setTarjeta(parts.join(" "));
              }}
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full">Finalizar compra</Button>
          </form>
        </>
      )}
    </div>
  );
}
