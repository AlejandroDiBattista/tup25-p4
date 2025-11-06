'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Register() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);

    try {
      const res = await fetch(`${API_URL}/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(await res.text());

      toast.success('Registrado correctamente');
      setTimeout(() => router.push('/auth/login'), 1200);
    } catch {
      toast.error('No se pudo registrar. Verificá el email o intentá de nuevo.');
    } finally {
      clearTimeout(t);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-background to-muted/40 p-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>Registrate para continuar tu compra</CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                placeholder="Tu nombre"
                autoComplete="name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">Mínimo 4 caracteres.</p>
            </div>
          </CardContent>

          {/* Separador para alejar el botón del campo de contraseña */}
          <div className="mx-6 border-t" />

          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creando...' : 'Crear cuenta'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              ¿Ya tenés cuenta?{' '}
              <a className="underline" href="/auth/login">
                Iniciá sesión
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}