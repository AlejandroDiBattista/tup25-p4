"use client";

import { useState } from "react";

export default function CrearCuentaPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const respuesta = await fetch(`${API_URL}/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });

    if (respuesta.ok) {
      alert("Registro exitoso. Ahora inicia sesión.");
      window.location.href = "/ingresar";
    } else {
      const err = await respuesta.json().catch(() => ({}));
      alert(err.detail || "Error al registrarte.");
    }
  };

  return (
    <main className="flex justify-center mt-16 px-4">
      <div className="bg-white border rounded-lg p-8 w-full max-w-md shadow-sm">
        <h1 className="text-xl font-semibold mb-6 text-gray-900">Crear cuenta</h1>

        <form className="space-y-4" onSubmit={handleRegistro}>
          <div>
            <label className="text-sm text-gray-700">Nombre</label>
            <input
              type="text"
              className="border w-full rounded-md px-3 py-2 bg-white"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Correo</label>
            <input
              type="email"
              className="border w-full rounded-md px-3 py-2 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Contraseña</label>
            <input
              type="password"
              className="border w-full rounded-md px-3 py-2 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-medium py-2 rounded-md hover:bg-gray-800 transition"
          >
            Registrarme
          </button>

          <div className="text-sm text-gray-600 text-center">
            ¿Ya tienes cuenta?{" "}
            <a href="/ingresar" className="text-gray-800 hover:underline">
              Inicia sesión
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
