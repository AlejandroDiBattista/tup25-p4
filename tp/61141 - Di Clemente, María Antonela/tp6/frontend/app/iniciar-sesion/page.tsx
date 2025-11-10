"use client";

import Link from "next/link";

export default function IniciarSesionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">
          Iniciar sesión
        </h1>

        <form className="space-y-4">
          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tuemail@ejemplo.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Botón Entrar */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Entrar
          </button>
        </form>

        {/* Enlace a registro */}
        <p className="text-sm text-center text-gray-600 mt-4">
          ¿No tienes cuenta?{" "}
          <Link
            href="/registrar"
            className="text-black font-medium hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
