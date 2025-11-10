"use client";
import { AuthForm } from "../components/AuthForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const handleAuthSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
        {success ? (
          <div className="text-green-600 text-center font-semibold mb-4">¡Inicio de sesión exitoso! Redirigiendo...</div>
        ) : (
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        )}
      </div>
    </div>
  );
}
