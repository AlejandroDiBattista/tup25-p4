import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { InputText } from "@/components/ui/input-text";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createData } from "@/lib/DataSQLite.js";
import Link from "next/link";

export default function CrearContactoPage() {
  
  async function crearContacto(formData) {
    'use server';
    
    // Extraer datos del formulario
    const nuevoContacto = {
      nombre:   formData.get('nombre'),
      apellido: formData.get('apellido'),
      edad:    +formData.get('edad'),
      telefono: formData.get('telefono'),
    };
    
    createData(nuevoContacto)
    
    if (resultado) {
      revalidatePath('/'); // Revalidar el caché de la página principal
      redirect('/');
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Agregar Contacto</CardTitle>
          <CardDescription>Completa los datos del nuevo contacto</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={crearContacto} className="space-y-6">
            <InputText name="nombre" required />
            <InputText name="apellido" required />
            <InputText name="edad" type="number" min={1} max={120} required />
            <InputText name="telefono" type="tel" required />
            
            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1"> Guardar Contacto </Button>
              <Link href="/">
                <Button type="button" variant="outline" className="flex-1"> Cancelar </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}