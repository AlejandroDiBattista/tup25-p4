// frontend/app/types.ts

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  existencia: number;
}

// Lo que enviamos a la API (POST /carrito)
export interface ItemCarritoCreate {
  producto_id: number;
  cantidad: number;
}

// Lo que la API nos devuelve
export interface ItemCarritoResponse {
  id: number;
  producto_id: number;
  cantidad: number;
  // --- ¡Campos nuevos! ---
  nombre_producto: string;
  precio_unitario: number;
  subtotal: number;
}

// --- ¡NUEVA INTERFAZ! ---
// Esta es la respuesta completa de GET /carrito
export interface CarritoResponse {
  id: number;
  estado: string;
  items: ItemCarritoResponse[]; // <-- Una lista de los items de arriba
  total: number;
  cantidad_items: number;
}