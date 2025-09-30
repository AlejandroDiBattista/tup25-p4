import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50/50 backdrop-blur supports-[backdrop-filter]:bg-gray-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Logo y descripción */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">ContactManager</h3>
              <p className="text-sm text-gray-600">
                La herramienta profesional para gestionar tus contactos de manera eficiente
              </p>
            </div>
          </div>

          {/* Enlaces de navegación */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <div className="flex flex-col space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">Recursos</h4>
              <div className="flex flex-col space-y-1">
                <Button variant="ghost" size="sm" className="justify-start h-auto p-0 text-gray-600 hover:text-gray-900">
                  FAQ
                </Button>
                <Button variant="ghost" size="sm" className="justify-start h-auto p-0 text-gray-600 hover:text-gray-900">
                  Guía de Usuario
                </Button>
                <Button variant="ghost" size="sm" className="justify-start h-auto p-0 text-gray-600 hover:text-gray-900">
                  Soporte Técnico
                </Button>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">Empresa</h4>
              <div className="flex flex-col space-y-1">
                <Button variant="ghost" size="sm" className="justify-start h-auto p-0 text-gray-600 hover:text-gray-900">
                  About
                </Button>
                <Button variant="ghost" size="sm" className="justify-start h-auto p-0 text-gray-600 hover:text-gray-900">
                  Política de Privacidad
                </Button>
                <Button variant="ghost" size="sm" className="justify-start h-auto p-0 text-gray-600 hover:text-gray-900">
                  Términos de Uso
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Línea separadora y copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2024 ContactManager. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="h-auto p-0 text-gray-500 hover:text-gray-700">
                Privacidad
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-gray-500 hover:text-gray-700">
                Términos
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-gray-500 hover:text-gray-700">
                Contacto
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}