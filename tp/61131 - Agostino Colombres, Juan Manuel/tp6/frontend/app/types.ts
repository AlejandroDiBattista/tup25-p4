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

export interface RegistroForm {
  nombre: string;
  email: string;
  password: string;
}

export interface RegistroResponse {
  id: number;
  nombre: string;
  email: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
