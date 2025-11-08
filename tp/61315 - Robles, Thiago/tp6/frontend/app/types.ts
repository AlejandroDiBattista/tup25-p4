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
  usuario_id: number;
  estado: string;
}

 export interface CarritoItem {
  id: number;
  carrito_id: number;
  producto_id: number;
  cantidad: number;
 }


 export interface Compra{
  id: number;
  usuario_id: number;
  fecha: string;
  direccion: string;
  tarjeta : string;
  total: number;
  envio: number;
  estado: string;
 }

export interface CompraItem{
  id: number;
  compra_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
 }

 export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  contraseña: string;
 }
