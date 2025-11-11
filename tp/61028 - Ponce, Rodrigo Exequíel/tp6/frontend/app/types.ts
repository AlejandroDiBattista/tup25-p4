// frontend/app/types.ts

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  existencia: number;
}

// --- AÑADE ESTO ---

// Lo que enviamos a la API (POST /carrito)
export interface ItemCarritoCreate {
  producto_id: number;
  cantidad: number;
}

// Lo que la API nos devuelve
export interface ItemCarritoResponse {
  id: number;
  carrito_id: number;
  producto_id: number;
  cantidad: number;
}