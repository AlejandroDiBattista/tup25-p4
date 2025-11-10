import React, { useState } from "react";

interface Usuario {
  usuario_id: number;
  nombre: string;
  email: string;
  access_token?: string;
  token_type?: string;
}

interface AuthFormProps {
  onAuthSuccess: (token: string, user: Usuario) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? "/iniciar-sesion" : "/registrar";
      const body = isLogin
        ? { email, password }
        : { nombre, email, password };
      const res = await fetch(
        `http://localhost:8000${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.mensaje || "Error");
      if (isLogin) {
        onAuthSuccess(data.access_token, data);
      } else {
        setIsLogin(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            required
          />
        </div>
        {error && <div className="rounded bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-black transition"
          disabled={loading}
        >
          {loading ? "Procesando..." : isLogin ? "Ingresar" : "Registrar"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          className="text-gray-900 hover:text-black underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </div>
    </div>
  );
};
