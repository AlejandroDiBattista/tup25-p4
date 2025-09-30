import { Header } from "./Header"
import { Footer } from "./Footer"

interface LayoutProps {
  children: React.ReactNode
  onAddContact?: () => void
}

export function Layout({ children, onAddContact }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      <Header onAddContact={onAddContact} />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}