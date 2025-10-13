import { useState } from 'react'
import TarjetaPersona from './TarjetaPersona'
import InputSearch from './InputSearch'
import './App.css'

function App() {
  const [busqueda, setBusqueda] = useState('');

  // Datos de las personas
  const personas = [
    {
      nombre: "Juan",
      apellido: "Pérez",
      puesto: "Desarrollador Frontend",
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      telefono: "+54 11 1234-5678",
      email: "juan.perez@example.com"
    },
    {
      nombre: "María",
      apellido: "García",
      puesto: "Product Manager",
      foto: "https://images.unsplash.com/photo-1494790108755-2616b612b1e8?w=200&h=200&fit=crop&crop=face",
      telefono: "+54 11 2345-6789",
      email: "maria.garcia@example.com"
    },
    {
      nombre: "Carlos",
      apellido: "Rodríguez",
      puesto: "Backend Engineer",
      foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      telefono: "+54 11 3456-7890",
      email: "carlos.rodriguez@example.com"
    },
    {
      nombre: "Ana",
      apellido: "Martínez",
      puesto: "UX Designer",
      foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      telefono: "+54 11 4567-8901",
      email: "ana.martinez@example.com"
    },
    {
      nombre: "Luis",
      apellido: "González",
      puesto: "Data Scientist",
      foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      telefono: "+54 11 5678-9012",
      email: "luis.gonzalez@example.com"
    },
    {
      nombre: "Sofía",
      apellido: "López",
      puesto: "DevOps Engineer",
      foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
      telefono: "+54 11 6789-0123",
      email: "sofia.lopez@example.com"
    }
  ];

  // Filtrar personas según la búsqueda
  const personasFiltradas = personas.filter(persona => 
    persona.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    persona.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    persona.puesto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Directorio de Personas
        </h1>
        
        {/* Campo de búsqueda */}
        <InputSearch 
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por nombre, apellido o puesto..."
        />
        
        {/* Mostrar cantidad de resultados */}
        {busqueda && (
          <div className="text-center mb-4">
            <p className="text-gray-600">
              {personasFiltradas.length} {personasFiltradas.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
          </div>
        )}
        
        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personasFiltradas.length > 0 ? (
            personasFiltradas.map((persona, index) => (
              <TarjetaPersona 
                key={index}
                nombre={persona.nombre}
                apellido={persona.apellido}
                puesto={persona.puesto}
                foto={persona.foto}
                telefono={persona.telefono}
                email={persona.email}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">No se encontraron resultados para "{busqueda}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
