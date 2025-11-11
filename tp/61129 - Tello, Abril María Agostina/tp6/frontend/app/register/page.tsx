import { useState } from "react";
import { useRouter } from "next/navigation";

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password })
    });
    if (res.ok) {
      router.push("/");
    } else {
      alert("Error al registrarse");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-100 border-b border-gray-300 shadow-sm px-8 py-4 flex items-center justify-between">
        <div className="font-bold text-xl">TP6 Shop</div>
        <div className="flex gap-4 items-center">
          <a href="/" className="font-bold text-gray-700 hover:text-blue-600 hover:underline transition">Productos</a>
          <a href="/login" className="font-bold text-gray-700 hover:text-blue-600 hover:underline transition">Ingresar</a>
          <a href="/register" className="bg-blue-600 px-4 py-2 rounded font-bold text-white shadow hover:bg-transparent hover:text-blue-600 border border-blue-600 transition">Crear cuenta</a>
        </div>
      </nav>
      <div className="flex items-center justify-center py-16">
        <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h2>
          <label className="block mb-2 text-base font-semibold text-gray-700">Nombre</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full mb-5 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition" placeholder="Nombre" required />
          <label className="block mb-2 text-base font-semibold text-gray-700">Correo</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mb-5 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition" placeholder="Correo" required />
          <label className="block mb-2 text-base font-semibold text-gray-700">Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mb-7 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition" placeholder="Contraseña" required />
          <button type="submit" className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold border border-blue-700 shadow hover:bg-transparent hover:text-blue-700 transition">Registrarme</button>
          <div className="mt-6 text-center text-base">
            ¿Ya tienes cuenta? <a href="/login" className="text-blue-600 font-semibold hover:underline">Inicia sesión</a>
          </div>
        </form>
      </div>
    </div>
  );
}
