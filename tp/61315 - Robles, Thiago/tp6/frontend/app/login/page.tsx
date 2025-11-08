import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import 

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Inicia sesión</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input id="password" type="password" placeholder="••••••••" />
                    </div>
                    <Button className="w-full" type="submit">
                        Entrar
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center gap-1 text-sm text-muted-foreground">
                    <span>¿No tienes cuenta?</span>
                    <Link href="/registro" className="font-medium text-primary hover:underline">
                        Regístrate
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}