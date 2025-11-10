"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- ESTA ES LA PARTE CORREGIDA ---
// Usamos el alias '@' que configura shadcn/ui
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// --- FIN DE LA CORRECCIÓN ---

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formBody = new URLSearchParams();
    formBody.append('username', email); // El campo se llama 'username' en OAuth2
    formBody.append('password', password);

    try {
      const response = await fetch("http://localhost:8000/iniciar-sesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Email o contraseña incorrectos");
      }
      
      localStorage.setItem("token", data.access_token);
      router.push("/"); 

    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tu email y contraseña para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-red-500">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm">
          <p className="text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/registrar"
              className="font-medium text-primary hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}