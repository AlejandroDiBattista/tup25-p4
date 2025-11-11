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

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface SesionData {
  usuario: Usuario;
  token: string;
}

export interface ItemCarrito {
  producto_id: number;
  cantidad: number;
  nombre: string;
  precio: number;
}

export interface Carrito {
  id: number;
  usuario_id: number;
  estado: string;
  items: ItemCarrito[];
}

export interface Compra {
  id: number;
  usuario_id: number;
  fecha: string;
  direccion: string;
  total: number;
  envio: number;
  iva: number;
  items: ItemCarrito[];
}
