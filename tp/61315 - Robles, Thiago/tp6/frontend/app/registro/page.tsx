import Link from "next/link"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function page() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Registro</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input id="nombre" name="nombre" placeholder="Juan Pérez" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="correo">Correo</Label>
                            <Input
                                id="correo"
                                name="correo"
                                type="email"
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input id="password" name="password" type="password" />
                        </div>
                        <Button type="submit" className="w-full">
                            Crear cuenta
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center text-sm">
                    ¿Ya tienes cuenta?{" "}
                    <Link
                        href="/login"
                        className="ml-2 font-semibold text-primary underline-offset-4 hover:underline"
                    >
                        Inicia sesión
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
