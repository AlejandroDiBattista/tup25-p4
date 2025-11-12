"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { traerContactoPorId, actualizarContacto } from "@/lib/db";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, User, UserCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Esquema de validación con Zod
const contactoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  telefono: z.string().min(9, "El teléfono debe tener al menos 9 dígitos")
    .regex(/^[0-9]+$/, "El teléfono solo debe contener números"),
});

export default function Editar({ params }) {
  const { id } = params;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const contacto = traerContactoPorId(id);

  const form = useForm({
    resolver: zodResolver(contactoSchema),
    defaultValues: {
      nombre: contacto?.nombre || "",
      apellido: contacto?.apellido || "",
      telefono: contacto?.telefono || "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const contactoActualizado = actualizarContacto(id, data);
      if (contactoActualizado) {
        router.push(`/mostrar/${id}`);
      } else {
        console.error("No se pudo actualizar el contacto");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!contacto) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600 font-semibold">
              Contacto no encontrado
            </p>
            <div className="mt-4 text-center">
              <Link href="/listar">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a la lista
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Editar Contacto
          </CardTitle>
          <CardDescription>
            Modifica los datos del contacto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Apellido
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el apellido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Teléfono
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Link href={`/mostrar/${id}`}>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
