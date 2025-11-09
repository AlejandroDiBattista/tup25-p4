import { Carrito } from "../types";
import { cache } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Helper para incluir el token en el header
function getAuthHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ------------------------------------------------------------------
// GET /carrito → obtener carrito activo
// ------------------------------------------------------------------
export const obtenerCarrito = cache(async (): Promise<Carrito> => {
  const res = await fetch(`${API_URL}/carrito`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Error al obtener el carrito (${res.status})`);
  }

  const raw = await res.json();
  const carritoRaw = raw?.carrito ?? raw;

  // Si backend devuelve sin carrito (no debería por auto-creación), devolver vacío
  if (!carritoRaw || !carritoRaw.id) {
    return {
      id: 0,
      usuario_id: 0,
      estado: "activo",
      productos: [],
      total: 0,
    };
  }

  // Mapear items del backend → productos[] esperados por el frontend
  interface RawProducto {
    id?: number;
    titulo?: string;
    nombre?: string;
    precio?: number;
    existencia?: number;
    imagen?: string;
    categoria?: string;
    activo?: boolean;
  }
  interface RawItem {
    producto_id?: number;
    cantidad?: number;
    subtotal?: number;
    producto?: RawProducto;
    // llano (cuando backend no anida producto)
    nombre?: string;
    precio?: number;
    existencia?: number;
    imagen?: string;
    categoria?: string;
  }
  const productos = (raw.items ?? []).map((it: RawItem) => {
    const prod = it.producto ?? ({} as RawProducto);
    const precio =
      typeof prod.precio === "number"
        ? prod.precio
        : typeof it.precio === "number"
        ? it.precio
        : 0;
    const cantidad = typeof it.cantidad === "number" ? it.cantidad : 0;
    return {
      producto_id: it.producto_id ?? prod.id ?? 0,
      nombre: prod.titulo ?? prod.nombre ?? it.nombre ?? "",
      precio,
      cantidad,
      subtotal:
        typeof it.subtotal === "number" ? it.subtotal : precio * cantidad,
      existencia: prod.existencia ?? it.existencia,
      imagen: prod.imagen ?? it.imagen,
      categoria: (prod.categoria ?? it.categoria) as string | undefined,
    };
  });

  return {
    id: carritoRaw.id,
    usuario_id: carritoRaw.usuario_id,
    estado: carritoRaw.estado,
    productos,
    total:
      raw.total ??
      carritoRaw.total ??
      productos.reduce((acc: number, p) => acc + (p.subtotal ?? 0), 0),
  };
});

// ------------------------------------------------------------------
// POST /carrito → agregar producto al carrito
// ------------------------------------------------------------------
export async function agregarProductoAlCarrito(
  producto_id: number,
  cantidad: number = 1
): Promise<{ message: string }> {
  const res = await fetch(
    `${API_URL}/carrito?producto_id=${producto_id}&cantidad=${cantidad}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Error al agregar producto al carrito");
  }

  return res.json();
}

// ------------------------------------------------------------------
// DELETE /carrito/{producto_id} → quitar producto del carrito
// ------------------------------------------------------------------
export async function quitarProductoDelCarrito(
  producto_id: number
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/carrito/${producto_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Error al quitar producto del carrito");
  }

  return res.json();
}

// ------------------------------------------------------------------
// POST /carrito/cancelar → cancelar carrito
// ------------------------------------------------------------------
export async function cancelarCarrito(): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/carrito/cancelar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Error al cancelar el carrito");
  }

  return res.json();
}

// ------------------------------------------------------------------
// POST /carrito/finalizar → finalizar compra
// ------------------------------------------------------------------
export async function finalizarCompra(
  direccion: string,
  tarjeta: string
): Promise<{ message: string; compra_id: number; total: number }> {
  const params = new URLSearchParams({ direccion, tarjeta });

  const res = await fetch(`${API_URL}/carrito/finalizar?${params.toString()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Error al finalizar la compra");
  }

  return res.json();
}
