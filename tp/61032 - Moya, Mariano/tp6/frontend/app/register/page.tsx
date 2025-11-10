"use client";
import { AuthForm } from "../components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h2>
        <AuthForm onAuthSuccess={() => {}} />
      </div>
    </div>
  );
}
