export interface Producto {
  id: number;
  titulo: string;
  precio: number;
  descripcion: string;
  categoria: string;
  valoracion: number;
  existencia: number;
  imagen: string;
}

export interface Carrito {
  id: number;
  productos: Producto[];
  total: number;
  cantidad: number;
  
}