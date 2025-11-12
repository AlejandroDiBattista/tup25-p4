"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputText } from "@/components/ui/input-text";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import * as Http from "@/lib/http";

export default function EditarContactoPage({ params }) {
  const router = useRouter();
  const { id } = use(params); // Unwrap params usando React.use()
  const [loading, setLoading] = useState(true);
  const [contacto, setContacto] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    telefono: "",
  });

  // Cargar datos del contacto
  useEffect(() => {
    async function cargarContacto() {
      const data = await Http.GET(`contactos/${id}`);
      if (data) {
        setContacto({
          nombre: data.nombre,
          apellido: data.apellido,
          edad: data.edad.toString(),
          telefono: data.telefono,
        });
      }
      setLoading(false);
    }
    cargarContacto();
  }, [id]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setContacto({ ...contacto, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = await Http.PUT(`contactos/${id}`, {
      nombre: contacto.nombre,
      apellido: contacto.apellido,
      edad: parseInt(contacto.edad),
      telefono: contacto.telefono,
    });

    if (data) {
      router.push("/");
      router.refresh(); // Forzar revalidación del caché
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-8">
            <div className="text-center">Cargando...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Editar Contacto</CardTitle>
          <CardDescription>Modifica los datos del contacto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputText 
                name="nombre"    
                value={contacto.nombre} 
                onChange={handleChange} required />
            <InputText 
                name="apellido"  
                value={contacto.apellido} 
                onChange={handleChange} required />
            <InputText 
                name="edad" 
                type="number"  
                min={1} 
                max={120} 
                value={contacto.edad} 
                onChange={handleChange} required />
            <InputText 
                name="telefono" 
                type="tel"  
                value={contacto.telefono} 
                onChange={handleChange} required />

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar datos"}
              </Button>
              <Link href="/" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
