import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Contact } from "./types"

interface ContactEditDialogProps {
  contact: Contact | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (contact: Contact) => void
}

export function ContactEditDialog({ 
  contact, 
  isOpen, 
  onOpenChange, 
  onSave 
}: ContactEditDialogProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!contact) return
    
    const formData = new FormData(e.currentTarget)
    const updatedContact: Contact = {
      id: contact.id,
      nombre: formData.get('nombre') as string,
      apellido: formData.get('apellido') as string,
      telefono: formData.get('telefono') as string,
      email: formData.get('email') as string,
      empresa: formData.get('empresa') as string,
      puesto: formData.get('puesto') as string,
      avatar: formData.get('avatar') as string,
    }
    
    onSave(updatedContact)
    onOpenChange(false)
  }

  if (!contact) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Contacto</DialogTitle>
            <DialogDescription>
              Modifica la información del contacto. Presiona guardar cuando hayas terminado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Primera línea: Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input 
                  id="nombre" 
                  name="nombre" 
                  defaultValue={contact.nombre}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input 
                  id="apellido" 
                  name="apellido" 
                  defaultValue={contact.apellido}
                  required
                />
              </div>
            </div>

            {/* Segunda línea: Teléfono y Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input 
                  id="telefono" 
                  name="telefono" 
                  type="tel"
                  defaultValue={contact.telefono}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  defaultValue={contact.email}
                  required
                />
              </div>
            </div>

            {/* Tercera línea: Empresa y Puesto */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa</Label>
                <Input 
                  id="empresa" 
                  name="empresa" 
                  defaultValue={contact.empresa}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="puesto">Puesto</Label>
                <Input 
                  id="puesto" 
                  name="puesto" 
                  defaultValue={contact.puesto}
                  required
                />
              </div>
            </div>

            {/* Cuarta línea: Avatar */}
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL (GitHub)</Label>
              <Input 
                id="avatar" 
                name="avatar" 
                type="url"
                placeholder="https://github.com/username.png"
                defaultValue={contact.avatar}
                required
              />
              <p className="text-xs text-gray-500">
                Formato: https://github.com/username.png
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}