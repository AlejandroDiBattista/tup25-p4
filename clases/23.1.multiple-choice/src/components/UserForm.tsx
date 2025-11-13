"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
}

interface UserFormProps {
  data: FormData;
  title?: string;
  description?: string;
}

export default function UserForm({ 
  data,
  title = "Información Personal",
  description = "Visualiza tu información personal"
}: UserFormProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              value={data.nombre}
              disabled
              readOnly
              placeholder="No especificado"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              name="apellido"
              type="text"
              value={data.apellido}
              disabled
              readOnly
              placeholder="No especificado"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              value={data.telefono}
              disabled
              readOnly
              placeholder="No especificado"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={data.email}
              disabled
              readOnly
              placeholder="No especificado"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}