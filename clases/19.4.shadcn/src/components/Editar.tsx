"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FmInput } from "@/components/ui/fm-input";
import { FnGroup } from "@/components/ui/fn-group";
import { useForm } from "react-hook-form";

type EditarFormValues = {
  nombre: string;
  apellido: string;
  telefono: string;
  domicilio: string;
};

export default function Editar() {
  const [datos, setDatos] = React.useState<EditarFormValues>({
    nombre: "Ada",
    apellido: "Lovelace",
    telefono: "+1 555 123 456",
    domicilio: "Calle Ejemplo 123",
  });

  const form = useForm<EditarFormValues>({
    defaultValues: datos,
  });

  React.useEffect(() => {
    form.reset(datos);
  }, [datos, form]);

  const onSubmit = form.handleSubmit((values) => {
    setDatos(values);
  });

  return (
    <section className="w-full max-w-md space-y-6 rounded-xl border border-border bg-background/80 p-6 shadow-sm backdrop-blur">
      <Form {...form}>
        <form onSubmit={onSubmit} className="grid gap-4">
          <FnGroup cols={2} description="Nombres y apellidos legales" asFieldset>
            <FmInput
              control={form.control}
              name="nombre"
              rules={{ required: "El nombre es obligatorio 😅" }}
            />
            <FmInput
              control={form.control}
              name="apellido"
              rules={{ required: "El apellido es obligatorio" }}
            />
          </FnGroup>
        <FnGroup cols={2} description="Información de domicilio" asFieldset>

        <FmInput
          control={form.control}
          name="domicilio"
          rules={{ required: "El domicilio es obligatorio" }}
        />
          <FmInput
            control={form.control}
            name="telefono"
            rules={{
              required: "El teléfono es obligatorio",
              minLength: { value: 7, message: "Ingresa al menos 7 caracteres" },
            }}
          />
          </FnGroup>
          <Button type="submit" className="w-full">
            Guardar cambios
          </Button>
        </form>
      </Form>
      
    </section>
  );
}
