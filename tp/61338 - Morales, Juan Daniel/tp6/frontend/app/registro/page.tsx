"use client";
import { useState } from "react";
import { Auth } from "../services/productos";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await Auth.registrar(nombre, email, password);
      alert("Usuario creado con éxito");
      router.push("/login");
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Error al registrar usuario";
      alert(msg);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto card space-y-3">
      <h1 className="text-xl font-semibold">Registrarme</h1>

      <input
        className="input"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn">Crear cuenta</button>
    </form>
  );
}
