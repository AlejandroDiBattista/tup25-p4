'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '../store/auth'

interface CompraItem {
  id: number
  producto_id: number
  cantidad: number
  nombre: string
  precio_unitario: number
}

interface Compra {
  id: number
  fecha: string
  direccion: string
  tarjeta: string
  total: number
  envio: number
  items: CompraItem[]
}

export default function MisCompras() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [compras, setCompras] = useState<Compra[]>([])
  const [compraSeleccionada, setCompraSeleccionada] = useState<Compra | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    cargarCompras()
  }, [token, router])

  const cargarCompras = async () => {
    try {
      const response = await fetch('http://localhost:8000/compras', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al cargar compras')
      }

      const data = await response.json()
      setCompras(data)
    } catch (err) {
      setError('Error al cargar el historial de compras')
    }
  }

  const verDetalles = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/compras/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al cargar detalles')
      }

      const data = await response.json()
      setCompraSeleccionada(data)
    } catch (err) {
      setError('Error al cargar detalles de la compra')
    }
  }

  return (
    <div className="min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-6">Mis compras</h2>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Historial</h3>
          <div className="space-y-4">
            {compras.map((compra) => (
              <div
                key={compra.id}
                className="border p-4 rounded cursor-pointer hover:bg-gray-50"
                onClick={() => verDetalles(compra.id)}
              >
                <div className="flex justify-between">
                  <span className="font-medium">Compra #{compra.id}</span>
                  <span>${compra.total.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(compra.fecha).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {compraSeleccionada && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Detalle de la compra #{compraSeleccionada.id}
              </h3>
              <div className="border p-4 rounded">
                <div className="mb-4">
                  <div className="text-sm text-gray-500">Fecha</div>
                  <div>{new Date(compraSeleccionada.fecha).toLocaleString()}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-500">Dirección</div>
                  <div>{compraSeleccionada.direccion}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-500">Tarjeta</div>
                  <div>**** **** **** {compraSeleccionada.tarjeta}</div>
                </div>
                <div className="space-y-2">
                  {compraSeleccionada.items?.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.nombre}</span>
                        <span className="text-gray-500 ml-2">x{item.cantidad}</span>
                      </div>
                      <span>${(item.precio_unitario * item.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Envío</span>
                    <span>${compraSeleccionada.envio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2">
                    <span>Total</span>
                    <span>${compraSeleccionada.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}