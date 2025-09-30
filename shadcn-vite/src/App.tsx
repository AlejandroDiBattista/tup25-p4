import { useState } from "react"
import { Layout } from "@/components/layout"
import { 
  ContactsList, 
  ContactEditDialog, 
  initialContactsData,
  type Contact 
} from "@/components/contact"

function App() {
  const [contacts, setContacts] = useState<Contact[]>(initialContactsData)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setIsAddingNew(false)
    setIsDialogOpen(true)
  }

  const handleAddContact = () => {
    // Crear un contacto vacío para el formulario
    const newContact: Contact = {
      id: Date.now(),
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      empresa: "",
      puesto: "",
      avatar: ""
    }
    setEditingContact(newContact)
    setIsAddingNew(true)
    setIsDialogOpen(true)
  }

  const handleDeleteContact = (contact: Contact) => {
    setContacts(prev => prev.filter(c => c.id !== contact.id))
    console.log('Contacto eliminado:', contact)
  }

  const handleSaveContact = (updatedContact: Contact) => {
    if (isAddingNew) {
      // Agregar nuevo contacto
      setContacts(prev => [...prev, updatedContact])
      console.log('Nuevo contacto agregado:', updatedContact)
    } else {
      // Actualizar contacto existente
      setContacts(prev => 
        prev.map(contact => 
          contact.id === updatedContact.id ? updatedContact : contact
        )
      )
      console.log('Contacto actualizado:', updatedContact)
    }
    setIsAddingNew(false)
  }

  return (
    <Layout onAddContact={handleAddContact}>
      {/* Título de la sección */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Mis Contactos Profesionales
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Gestiona y organiza tu red de contactos profesionales. 
          Mantén actualizada la información de tus colegas, clientes y socios comerciales.
        </p>
      </div>
      
      {/* Lista de contactos */}
      <ContactsList 
        contacts={contacts}
        onEditContact={handleEditContact}
        onDeleteContact={handleDeleteContact}
      />

      {/* Diálogo de edición/creación */}
      <ContactEditDialog
        contact={editingContact}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveContact}
      />
    </Layout>
  )
}

export default App