import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BirthdayPicker } from "@/components/ui/birthday-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlowingEffect } from "@/components/ui/glowing-effect"

interface UserFormData {
  nombre: string
  apellido: string
  telefono: string
  email: string
  fechaCumpleanos?: Date
}

export function UserFormDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<UserFormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    fechaCumpleanos: undefined
  })

  const handleInputChange = (field: keyof UserFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Datos del formulario:", formData)
    // Aquí puedes agregar la lógica para enviar los datos
    setOpen(false)
    // Opcional: resetear el formulario
    setFormData({
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      fechaCumpleanos: undefined
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="relative inline-block">
        <GlowingEffect
          spread={15}
          glow={true}
          disabled={false}
          proximity={40}
          inactiveZone={0.01}
          borderWidth={1}
          className="absolute inset-0 rounded-md"
        />
        <DialogTrigger asChild>
          <Button variant="outline" className="relative z-10">
            Editar Usuario
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar información del usuario</DialogTitle>
          <DialogDescription>
            Modifica los datos del usuario. Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={handleInputChange("nombre")}
                placeholder="Ingresa tu nombre"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apellido">
                Apellido
              </Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={handleInputChange("apellido")}
                placeholder="Ingresa tu apellido"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefono">
                Teléfono
              </Label>
              <Input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleInputChange("telefono")}
                placeholder="Ingresa tu teléfono"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                placeholder="Ingresa tu email"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Fecha de cumpleaños</Label>
              <BirthdayPicker
                date={formData.fechaCumpleanos}
                onSelect={(date) => setFormData(prev => ({ ...prev, fechaCumpleanos: date }))}
                placeholder="Selecciona tu fecha de cumpleaños"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}