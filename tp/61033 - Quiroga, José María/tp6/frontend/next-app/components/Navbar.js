import Link from 'next/link'

export default function Navbar(){
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return (
    <nav className="bg-white shadow-sm">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-emerald-700">Mi E-commerce</Link>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="text-sm text-slate-700 hover:text-emerald-600">Carrito</Link>
          {token ? (
            <button onClick={()=>{ localStorage.removeItem('token'); window.location.href='/' }} className="text-sm text-slate-700 hover:text-emerald-600">Cerrar sesión</button>
          ) : (
            <>
              <Link href="/login" className="text-sm text-slate-700 hover:text-emerald-600">Ingresar</Link>
              <Link href="/register" className="text-sm text-slate-700 hover:text-emerald-600">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
