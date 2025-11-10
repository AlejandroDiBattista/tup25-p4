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

export interface CartViewItem {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  imagen: string;
}

export interface CartTotals {
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
}

export interface CartView {
  estado: 'abierto' | 'finalizado' | 'cancelado' | string;
  items: CartViewItem[];
  totals: CartTotals;
}

export interface CompraItem {
  producto_id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  iva: number; 
}

export interface CompraResumen {
  id: number;
  fecha: string;        
  total: number;
}

export interface CompraDetalle {
  id: number;
  fecha: string;        
  direccion: string;
  tarjeta: string;      
  items: CompraItem[];
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
}
