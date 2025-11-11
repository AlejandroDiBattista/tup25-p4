import './globals.css'
import Navbar from './components/Navbar'

export const metadata = {
  title: 'TP6 Shop',
  description: 'TP6 - E-Commerce'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 text-slate-900">
        <Navbar />
        <main className="pt-20 pb-12 max-w-7xl mx-auto px-4">
          {children}
        </main>
      </body>
    </html>
  )
}