import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Edit2, Trash2 } from "lucide-react"
import { useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import type { Contact } from "./types"

interface ContactCardProps {
  contact: Contact
  onEdit: (contact: Contact) => void
  onDelete?: (contact: Contact) => void
}

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar size="lg" className="border-2 border-gray-200">
            <AvatarImage 
              src={contact.avatar} 
              alt={`${contact.nombre} ${contact.apellido}`}
              fallbackName={`${contact.nombre} ${contact.apellido}`}
            />
            <AvatarFallback className="bg-blue-600 text-white font-semibold">
              {contact.nombre[0]}{contact.apellido[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">
              {contact.nombre} {contact.apellido}
            </CardTitle>
            <CardDescription className="text-sm font-medium text-blue-600">
              {contact.puesto}
            </CardDescription>
            <CardDescription className="text-xs text-gray-500">
              {contact.empresa}
            </CardDescription>
          </div>
        </div>
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
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(contact)}
            className="p-2"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          {onDelete && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setConfirmOpen(true)}
                className="p-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                aria-label={`Eliminar contacto ${contact.nombre} ${contact.apellido}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="¿Eliminar contacto?"
                description={
                  <span>
                    Esta acción no se puede deshacer. Se eliminará el contacto <strong>{contact.nombre} {contact.apellido}</strong>.
                  </span>
                }
                cancelText="Cancelar"
                confirmText="Eliminar"
                confirmVariant="destructive"
                onConfirm={() => onDelete(contact)}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}