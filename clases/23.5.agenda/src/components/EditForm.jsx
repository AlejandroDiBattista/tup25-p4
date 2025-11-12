"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function EditForm({ contacto }) {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      nombre: contacto.nombre,
      apellido: contacto.apellido,
      telefono: contacto.telefono,
    },
  })

  async function onSubmit(values) {
    const res = await fetch(`/api/contactos/${contacto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      alert("Error al actualizar")
      return
    }
    router.push(`/mostrar/${contacto.id}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 w-full max-w-md">
        <FormItem>
          <FormLabel>Nombre</FormLabel>
          <FormControl>
            <Input {...form.register("nombre")} />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Apellido</FormLabel>
          <FormControl>
            <Input {...form.register("apellido")} />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Teléfono</FormLabel>
          <FormControl>
            <Input {...form.register("telefono")} />
          </FormControl>
          <FormMessage />
        </FormItem>

        <div className="flex gap-2">
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  )
}
