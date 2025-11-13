"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../services/auth";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(nombre, email, password);
      if (res.ok) {
        alert("Registrado. Inicia sesión.");
        router.push("/login");
      } else {
        const t = await res.text();
        alert("Error: " + t);
      }
    } catch (err) {
      alert("Error al registrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Nombre</label>
        <input className="w-full border p-2 mb-3" value={nombre} onChange={e => setNombre(e.target.value)} />
        <label className="block mb-2">Correo</label>
        <input className="w-full border p-2 mb-3" value={email} onChange={e => setEmail(e.target.value)} />
        <label className="block mb-2">Contraseña</label>
        <input type="password" className="w-full border p-2 mb-3" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? '...' : 'Registrarme'}</button>
      </form>
    </div>
  );
}
