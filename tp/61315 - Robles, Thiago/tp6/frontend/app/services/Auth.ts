import { UsuarioLogin, UsuarioRegistro, Usuario } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export const iniciarSesion = async (datos: UsuarioLogin) => {
  const respuesta = await fetch(`${API_URL}/iniciar-sesion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error(`Error al iniciar sesión (${respuesta.status})`);
  }

  return (await respuesta.json()) as { access_token: string; token_type: string };
};

export const registrarUsuario = async (datos: UsuarioRegistro) => {
  const respuesta = await fetch(`${API_URL}/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error(`Error al registrar usuario (${respuesta.status})`);
  }

  return (await respuesta.json()) as Usuario;
};