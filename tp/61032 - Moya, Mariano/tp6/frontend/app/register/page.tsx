"use client";
import { AuthForm } from "../components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Crear cuenta</h2>
        <AuthForm onAuthSuccess={() => {}} />
      </div>
    </div>
  );
}
