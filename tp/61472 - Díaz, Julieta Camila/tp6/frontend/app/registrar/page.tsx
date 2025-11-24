"use client";

import { FormEvent, useState } from "react";
import Navbar from "../../components/NavBar";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await register(nombre, email, password);
      router.push("/");
    } catch {
      setError("No se pudo registrar el usuario");
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex max-w-6xl justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-xl border bg-white px-6 py-6 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900 mb-4">
            Crear cuenta
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="text-sm">
              <label className="mb-1 block text-slate-700">Nombre</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="text-sm">
              <label className="mb-1 block text-slate-700">Correo</label>
              <input
                type="email"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="text-sm">
              <label className="mb-1 block text-slate-700">Contraseña</label>
              <input
                type="password"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white"
            >
              Registrarme
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-slate-900 underline">
              Inicia sesión
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}