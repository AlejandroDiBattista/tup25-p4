import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md border-slate-200 bg-white shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-slate-900">
            Iniciar sesión
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-600">
              Correo
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              className="h-12 rounded-lg border-slate-200 text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-600">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              className="h-12 rounded-lg border-slate-200 text-slate-700"
            />
          </div>

          <Button className="h-11 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white hover:bg-slate-900/90">
            Entrar
          </Button>

          <p className="text-center text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="font-semibold text-slate-900 hover:underline">
              Registrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
