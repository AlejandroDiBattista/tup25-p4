import './App.css'
import ContactCard from './components/ContactCard'
import SearchBar from './components/SearchBar'
import EditContactModal from './components/EditContactModal'
import type { ContactInfo } from './components/ContactCard'
import { useState } from 'react'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [contacts, setContacts] = useState<ContactInfo[]>([
    {
      nombre: "Kendrick",
      apellido: "Lamar",
      telefono: "+1 323 555-0123",
      email: "kdot@pgLang.com",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      nombre: "Jay",
      apellido: "Z",
      telefono: "+1 212 555-0456",
      email: "hova@rocnation.com",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      nombre: "Tupac",
      apellido: "Shakur",
      telefono: "+1 213 555-0789",
      email: "makaveli@thuglife.com",
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
    },
    {
      nombre: "Biggie",
      apellido: "Smalls",
      telefono: "+1 718 555-0321",
      email: "biggie@badboy.com",
      imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face"
    },
    {
      nombre: "Eminem",
      apellido: "Marshall",
      telefono: "+1 313 555-0654",
      email: "slim.shady@shady.com",
      imageUrl: "https://images.unsplash.com/photo-1541647376583-8934aaf3448a?w=150&h=150&fit=crop&crop=face"
    }
  ]);

  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const handleEditContact = (contact: ContactInfo, index: number) => {
    setEditingContact(contact);
    setEditingIndex(index);
  };

  const handleSaveContact = (updatedContact: ContactInfo) => {
    if (editingIndex >= 0) {
      const newContacts = [...contacts];
      newContacts[editingIndex] = updatedContact;
      setContacts(newContacts);
    }
  };

  const handleCloseModal = () => {
    setEditingContact(null);
    setEditingIndex(-1);
  };

  // Filtrar contactos basado en el término de búsqueda
  const filteredContacts = contacts.filter(contact => 
    contact.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.telefono.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo a la izquierda */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ContactApp</h1>
                <p className="text-xs text-gray-500">Gestión de contactos</p>
              </div>
            </div>

            {/* Campo de búsqueda a la derecha */}
            <div className="flex-1 max-w-md ml-8">
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                resultsCount={filteredContacts.length}
                placeholder="Buscar contactos..."
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Título de la sección */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Lista de Contactos
          </h2>
          <p className="text-gray-600">
            Directorio personal de contactos
          </p>
        </div>

        {/* Grid de tarjetas de contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => {
              // Encontrar el índice original del contacto en la lista completa
              const originalIndex = contacts.findIndex(c => 
                c.nombre === contact.nombre && 
                c.apellido === contact.apellido && 
                c.email === contact.email
              );
              
              return (
                <ContactCard 
                  key={originalIndex} 
                  contactInfo={contact}
                  onEdit={() => handleEditContact(contact, originalIndex)}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron contactos</h3>
              <p className="text-gray-500">Intenta con un término de búsqueda diferente</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © 2025 ContactApp. Todos los derechos reservados.
            </p>
            <a 
              href="/about" 
              className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              About
            </a>
          </div>
        </div>
      </footer>

      {/* Modal de edición */}
      {editingContact && (
        <EditContactModal
          isOpen={true}
          contact={editingContact}
          onSave={handleSaveContact}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default App
