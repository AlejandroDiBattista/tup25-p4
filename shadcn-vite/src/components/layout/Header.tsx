import { SearchInput } from "@/components/ui/search"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/ThemeToggle"

interface HeaderProps {
  onAddContact?: () => void
}

export function Header({ onAddContact }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo a la izquierda */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ContactManager
                </h1>
                <p className="text-xs text-gray-500 -mt-1">
                  Gestión Profesional
                </p>
              </div>
            </div>
          </div>
          
          {/* Búsqueda y botones a la derecha */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            <div className="max-w-lg w-full sm:w-auto sm:min-w-[300px]">
              <SearchInput 
                placeholder="Buscar contactos, empresas, puestos..." 
                className="w-full"
                onChange={(e) => console.log('Búsqueda:', e.target.value)}
              />
            </div>
            <ThemeToggle />
            <Button 
              onClick={onAddContact}
              className="whitespace-nowrap"
            >
              Agregar Contacto
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}