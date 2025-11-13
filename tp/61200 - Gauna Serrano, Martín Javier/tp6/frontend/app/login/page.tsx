"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      alert("Error de login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Correo</label>
        <input className="w-full border p-2 mb-3" value={email} onChange={e => setEmail(e.target.value)} />
        <label className="block mb-2">Contraseña</label>
        <input type="password" className="w-full border p-2 mb-3" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? '...' : 'Entrar'}</button>
      </form>
    </div>
  );
}
