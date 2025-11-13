export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagen: string;
  tipo_iva: string;
  descripcion: string;
  cantidad?: number; // para carrito
}