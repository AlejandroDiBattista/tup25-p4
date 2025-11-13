export interface Producto {
  id: number;
  titulo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  descripcion: string;
  categoria: string;
  valoracion: number;
  existencia: number;
  imagen: string;
}
  imagen?: string;
};

export type CartItem = {
  product: Product;
  cantidad: number;
};

export type Purchase = {
  id: number;
  fecha: string;
  direccion: string;
  tarjeta: string;
  total: number;
  envio: number;
  items: { nombre: string; cantidad: number; precio_unitario: number }[];
};
