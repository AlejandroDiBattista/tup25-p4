'use client';

import { useState, useEffect } from 'react';
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

export default function Login() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // NUEVO: detectar si ya hay sesión para no romper el login “normal”
  const [hasToken, setHasToken] = useState(false);
  const [nombreLS, setNombreLS] = useState<string | null>(null);

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setHasToken(!!t);
    setNombreLS(typeof window !== 'undefined' ? localStorage.getItem('usuario_nombre') : null);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), 15000);

    try {
      console.log('Login →', `${API_URL}/iniciar-sesion`);
      const res = await fetch(`${API_URL}/iniciar-sesion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        console.error('Login error:', res.status, txt);
        setErr(res.status === 401 ? 'Email o contraseña inválidos' : 'Error al iniciar sesión');
        toast.error('No se pudo iniciar sesión', { duration: 1800 });
        return;
      }

      const data = await res.json();
      const token: string | undefined = data?.access_token;
      const nombre: string | undefined = data?.user?.nombre;

      if (token) localStorage.setItem('token', token);
      if (nombre) localStorage.setItem('usuario_nombre', nombre);

      toast.success(nombre ? `Bienvenido, ${nombre}` : 'Inicio de sesión exitoso', { duration: 1600 });
      setTimeout(() => router.push('/'), 1600);
    } catch (e: any) {
      console.error('Network/Abort:', e);
      const aborted = e?.name === 'AbortError';
      setErr(aborted ? 'Tiempo de espera agotado' : 'No se pudo conectar con el servidor');
      toast.error(aborted ? 'Timeout' : 'Error de red', { duration: 1800 });
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_nombre');
    setHasToken(false);
    setNombreLS(null);
    toast.success('Sesión cerrada', { duration: 1200 });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-background to-muted/40 p-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>Accedé para continuar</CardDescription>
        </CardHeader>

        {/* Si ya hay token, no redirigimos: damos opciones y no “rompe” el login */}
        {hasToken ? (
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Ya iniciaste sesión{nombreLS ? ` como ${nombreLS}` : ''}.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => router.push('/')}>Ir al inicio</Button>
              <Button variant="destructive" onClick={logout}>Cerrar sesión</Button>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-6">
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {err && <p className="text-sm text-red-600">{err}</p>}
            </CardContent>

            <div className="mx-6 border-t" />

            <CardFooter className="flex flex-col gap-4 pt-6">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Ingresando...' : 'Entrar'}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                ¿No tenés cuenta? <a href="/auth/registro" className="underline">Registrate</a>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}