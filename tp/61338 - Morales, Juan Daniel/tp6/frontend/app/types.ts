export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  categoria?: string | null;
  existencia?: number | null;
  imagen?: string | null;
  valoracion?: number | null;
}