import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { getCart, finalizeCart } from '../lib/api'

export default function Cart(){
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [direccion, setDireccion] = useState('')
  const [tarjeta, setTarjeta] = useState('')

  useEffect(()=>{ load() }, [])
  async function load(){
    const data = await getCart()
    setCart(data || { items: [], total: 0 })
  }

  async function handleFinalize(e){
    e.preventDefault()
    const res = await finalizeCart(direccion, tarjeta)
    if(res.ok){ alert('Compra finalizada'); window.location.href='/'; } else alert('Error al finalizar')
  }

  return (
    <div>
      <Navbar />
      <main className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Tu carrito</h1>
        <div className="bg-white p-4 rounded shadow">
          {(() => {
            const items = cart?.items ?? []
            const total = Number(cart?.total ?? 0)
            if (items.length === 0) return <div>Carrito vacío</div>
            return (
              <div>
                {items.map(it=> (
                  <div key={it.producto?.id || it.producto?.producto_id} className="flex justify-between py-2 border-b">
                    <div>
                      <div className="font-semibold">{it.producto?.nombre || it.producto?.titulo}</div>
                      <div className="text-sm">Cantidad: {it.cantidad}</div>
                    </div>
                    <div>${Number(it.subtotal ?? 0).toFixed(2)}</div>
                  </div>
                ))}
                <div className="text-right font-bold mt-4">Total: ${total.toFixed(2)}</div>
              </div>
            )
          })()}
        </div>

        <form onSubmit={handleFinalize} className="mt-6 max-w-md">
          <label>Dirección</label>
          <input className="w-full border p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={direccion} onChange={e=>setDireccion(e.target.value)} />
          <label>Tarjeta</label>
          <input className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={tarjeta} onChange={e=>setTarjeta(e.target.value)} />
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-150">Finalizar compra</button>
        </form>
      </main>
    </div>
  )
}
