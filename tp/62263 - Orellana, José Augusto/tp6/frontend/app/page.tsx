import { cookies } from 'next/headers';
import { obtenerProductos } from './services/productos';
import ProductCatalog from './components/ProductCatalog';
import type { Carrito, Usuario } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function obtenerPerfil(token: string): Promise<Usuario | null> {
  try {
    const response = await fetch(`${API_URL}/perfil`, {
      cache: 'no-store',
      headers: {
        Cookie: `token=${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return null;
  }
}

async function obtenerCarrito(token: string): Promise<Carrito | null> {
  try {
    const response = await fetch(`${API_URL}/carrito`, {
      cache: 'no-store',
      headers: {
        Cookie: `token=${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    return null;
  }
}

export default async function Home() {
  const productos = await obtenerProductos();
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  let usuario: Usuario | null = null;
  let carrito: Carrito | null = null;

  if (token) {
    usuario = await obtenerPerfil(token.value);

    if (usuario) {
      carrito = await obtenerCarrito(token.value);
    }
  }

  return <ProductCatalog productos={productos} usuario={usuario} carrito={carrito} />;
}
