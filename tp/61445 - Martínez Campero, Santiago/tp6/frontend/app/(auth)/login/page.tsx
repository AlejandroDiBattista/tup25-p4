'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { iniciarSesion } from '@/app/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await iniciarSesion(email, password);
      router.push('/productos');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">TP6 Shop</h1>
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          <p>
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
