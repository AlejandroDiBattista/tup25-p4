// Corresponde a UsuarioRead del backend
export interface Usuario {
    id: number;
    nombre: string;
    email: string;
}

// Corresponde a UsuarioCreate del backend
export interface UsuarioCreate {
    nombre: string;
    email: string;
    password: string;
}

// Corresponde a ProductoRead del backend
export interface Producto {
    id: number;
    titulo: string;
    precio: number;
    descripcion: string;
    categoria: string;
    imagen: string;
    existencia: number;
}

// Corresponde a CarritoRead del backend
export interface CarritoRead {
    items: { producto: Producto; cantidad: number }[];
    subtotal: number;
    costo_envio: number;
    iva: number;
    total: number;
}

// Corresponde a ItemCarritoCreate del backend
export interface ItemCarritoCreate {
    producto_id: number;
    cantidad: number;
}
