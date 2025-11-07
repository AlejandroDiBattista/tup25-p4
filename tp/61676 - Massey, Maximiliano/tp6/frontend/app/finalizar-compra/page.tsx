'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import useCartStore from '../store/cart'
import useAuthStore from '../store/auth'

export default function FinalizarCompra() {
  const router = useRouter()
  const [direccion, setDireccion] = useState('')
  const [tarjeta, setTarjeta] = useState('')
  const [error, setError] = useState('')
  const { items, total, clearCart } = useCartStore()
  const { token } = useAuthStore()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('http://localhost:8000/carrito/finalizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ direccion, tarjeta })
      })

      if (!response.ok) {
        throw new Error('Error al finalizar la compra')
      }

      clearCart()
      router.push('/mis-compras')
    } catch (err) {
      setError('Error al procesar la compra')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <h2 className="text-2xl font-bold mb-4">Carrito vacío</h2>
        <a href="/" className="text-blue-600 hover:underline">
          Volver a la tienda
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-6">Finalizar compra</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Resumen del carrito</h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <span className="font-medium">{item.nombre}</span>
                  <span className="text-gray-500 ml-2">x{item.cantidad}</span>
                </div>
                <span>${(item.precio * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Datos de envío</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Dirección de envío
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Número de tarjeta
              </label>
              <input
                type="text"
                value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value)}
                className="w-full p-2 border rounded"
                pattern="[0-9]{16}"
                maxLength={16}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Confirmar compra
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}