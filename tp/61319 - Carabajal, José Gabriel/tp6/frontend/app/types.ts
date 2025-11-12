// frontend/app/types.ts

// ---- PRODUCTO ----
export type Producto = {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  existencia: number; // stock disponible
  valoracion?: number; // opcional, por si no todos los productos lo tienen
};

// ---- Ítems del carrito ----
export type CartViewItem = {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  imagen: string;

  // Campos nuevos de control de stock
  stock_disponible: number;
  max_cantidad: number;
};

// ---- Totales del carrito ----
export type CartTotals = {
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
};

// ---- Vista completa del carrito ----
export type CartView = {
  estado: 'abierto' | 'finalizado' | 'cancelado' | string;
  items: CartViewItem[];
  totals: CartTotals;
};
