import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SearchInput } from "@/components/ui/search"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Tipo para los contactos
type Contact = {
  id: number
  nombre: string
  apellido: string
  telefono: string
  email: string
  empresa: string
  puesto: string
}

// Datos de ejemplo de contactos
const initialContactsData: Contact[] = [
  {
    id: 1,
    nombre: "Ana",
    apellido: "García",
    telefono: "+54 11 1234-5678",
    email: "ana.garcia@email.com",
    empresa: "Tech Solutions",
    puesto: "Desarrolladora Frontend"
  },
  {
    id: 2,
    nombre: "Carlos",
    apellido: "Rodríguez",
    telefono: "+54 11 2345-6789",
    email: "carlos.rodriguez@email.com",
    empresa: "Digital Marketing",
    puesto: "Especialista en SEO"
  },
  {
    id: 3,
    nombre: "María",
    apellido: "López",
    telefono: "+54 11 3456-7890",
    email: "maria.lopez@email.com",
    empresa: "Design Studio",
    puesto: "Diseñadora UX/UI"
  },
  {
    id: 4,
    nombre: "Diego",
    apellido: "Martínez",
    telefono: "+54 11 4567-8901",
    email: "diego.martinez@email.com",
    empresa: "StartUp Inc",
    puesto: "Product Manager"
  },
  {
    id: 5,
    nombre: "Laura",
    apellido: "Fernández",
    telefono: "+54 11 5678-9012",
    email: "laura.fernandez@email.com",
    empresa: "Consulting Group",
    puesto: "Consultora Senior"
  }
]

export function ContactEditDialog({ 
  contact, 
  isOpen, 
  onOpenChange, 
  onSave 
}: { 
  contact: Contact | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (contact: Contact) => void
}) {
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
export function ContactCard({ 
  contact, 
  onEdit 
}: { 
  contact: Contact
  onEdit: (contact: Contact) => void
}) {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">
          {contact.nombre} {contact.apellido}
        </CardTitle>
        <CardDescription className="text-sm font-medium text-blue-600">
          {contact.puesto}
        </CardDescription>
        <CardDescription className="text-xs text-gray-500">
          {contact.empresa}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">📞</span>
            <span className="text-gray-700">{contact.telefono}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">✉️</span>
            <span className="text-gray-700">{contact.email}</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onEdit(contact)}
        >
          Editar Contacto
        </Button>
      </CardContent>
    </Card>
  )
}

export function ContactsList({ 
  contacts, 
  onEditContact 
}: { 
  contacts: Contact[]
  onEditContact: (contact: Contact) => void
}) {
  return (
    <div className="w-full max-w-4xl space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Lista de Contactos
        </h2>
        <p className="text-gray-600">
          {contacts.length} contactos disponibles
        </p>
      </div>
      
      {/* Grid responsivo de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <ContactCard 
            key={contact.id} 
            contact={contact} 
            onEdit={onEditContact}
          />
        ))}
      </div>
    </div>
  )
}

export function ContactEditDialog({ 
  contact, 
  isOpen, 
  onOpenChange, 
  onSave 
}: { 
  contact: Contact | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (contact: Contact) => void
}) {
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

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-start gap-8 p-8 bg-gray-50">
      {/* Título principal */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Panel de Gestión
        </h1>
        <p className="text-gray-600">
          Gestiona tu información personal y contactos
        </p>
      </div>
      
      {/* Búsqueda global */}
      <div className="w-full max-w-lg">
        <SearchInput 
          placeholder="Buscar contactos, usuarios, etc..." 
          className="w-full"
          onChange={(e) => console.log('Búsqueda:', e.target.value)}
        />
      </div>
      
      {/* Formulario de usuario */}
      <UserForm />
      
      {/* Lista de contactos */}
      <ContactsList />
    </div>
  )
}
 
export default App