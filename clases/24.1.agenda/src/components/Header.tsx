import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="outline" className="font-semibold">
              🏠 Home
            </Button>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          {/* Aquí puedes agregar más elementos de navegación si los necesitas */}
        </nav>
      </div>
    </header>
  )
}