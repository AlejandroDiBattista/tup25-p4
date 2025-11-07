"use client";

import { useState } from "react";

export default function IngresarPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const response = await fetch(
      `${API_URL}/iniciar-sesion?email=${email}&password=${password}`,
      { method: "POST" }
    );

    if (!response.ok) {
      alert("Correo o contraseña incorrectos");
      return;
    }

    const data = await response.json();

    localStorage.setItem("usuario_id", data.usuario_id);
    localStorage.setItem("usuario_nombre", data.usuario);

    window.location.href = "/";
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>

      <input
        className="w-full border p-2 mb-3 rounded"
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4 rounded"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Entrar
      </button>
    </div>
  );
}