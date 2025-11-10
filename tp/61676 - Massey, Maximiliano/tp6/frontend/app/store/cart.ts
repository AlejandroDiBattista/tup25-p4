import { create } from 'zustand'
import { Producto } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface CartItem extends Producto {
    cantidad: number
}

interface CartTotals {
    subtotal: number
    iva: number
    envio: number
    total: number
}

interface CartState {
    items: CartItem[]
    addItem: (producto: Producto, cantidad: number) => Promise<void>
    removeItem: (productoId: number) => Promise<void>
    updateQuantity: (productoId: number, cantidad: number) => Promise<void>
    clearCart: () => void
    getTotals: () => CartTotals
    itemCount: number
    syncWithBackend: () => Promise<void>
}

// Obtener token del usuario
const getToken = () => {
    if (typeof window === 'undefined') return null
    const authStorage = localStorage.getItem('auth-storage')
    if (!authStorage) return null
    try {
        const parsed = JSON.parse(authStorage)
        return parsed.state?.token
    } catch {
        return null
    }
}

const useCartStore = create<CartState>((set, get) => ({
    items: [],
    
    addItem: async (producto, cantidad) => {
        const token = getToken()
        
        if (token) {
            // Si hay usuario logueado, agregar al backend
            try {
                const response = await fetch(`${API_URL}/carrito/agregar/${producto.id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cantidad }),
                })
                
                if (!response.ok) {
                    throw new Error('Error al agregar al carrito')
                }
                
                // Sincronizar con backend después de agregar
                await get().syncWithBackend()
            } catch (error) {
                console.error('Error al agregar al carrito:', error)
                throw error
            }
        } else {
            // Si no hay usuario, guardar localmente
            set((state) => {
                const existingItem = state.items.find((item) => item.id === producto.id)
                
                if (existingItem) {
                    return {
                        items: state.items.map((item) =>
                            item.id === producto.id
                                ? { ...item, cantidad: item.cantidad + cantidad }
                                : item
                        ),
                    }
                }
                
                return {
                    items: [...state.items, { ...producto, cantidad }],
                }
            })
        }
    },
    
    removeItem: async (productoId) => {
        const token = getToken()
        
        if (token) {
            try {
                await fetch(`${API_URL}/carrito/quitar/${productoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                })
                
                await get().syncWithBackend()
            } catch (error) {
                console.error('Error al quitar del carrito:', error)
            }
        } else {
            set((state) => ({
                items: state.items.filter((item) => item.id !== productoId),
            }))
        }
    },
    
    updateQuantity: async (productoId, cantidad) => {
        const token = getToken()
        
        if (token) {
            try {
                // Primero quitar el item
                await fetch(`${API_URL}/carrito/quitar/${productoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                })
                
                // Luego agregarlo con la nueva cantidad
                if (cantidad > 0) {
                    await fetch(`${API_URL}/carrito/agregar/${productoId}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ cantidad }),
                    })
                }
                
                await get().syncWithBackend()
            } catch (error) {
                console.error('Error al actualizar cantidad:', error)
            }
        } else {
            set((state) => ({
                items: state.items.map((item) =>
                    item.id === productoId ? { ...item, cantidad } : item
                ),
            }))
        }
    },
    
    clearCart: () => set({ items: [] }),
    
    syncWithBackend: async () => {
        const token = getToken()
        
        if (!token) return
        
        try {
            const response = await fetch(`${API_URL}/carrito`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            
            if (response.ok) {
                const carritoBackend = await response.json()
                set({ items: carritoBackend })
            }
        } catch (error) {
            console.error('Error al sincronizar carrito:', error)
        }
    },
    
    getTotals: () => {
        const items = get().items
        const subtotal = items.reduce((total, item) => total + item.precio * item.cantidad, 0)
        
        // Calcular IVA según categoría (21% general, 10% electrónicos)
        const iva = items.reduce((total, item) => {
            const tasaIva = item.categoria === 'electronics' ? 0.10 : 0.21
            return total + (item.precio * item.cantidad * tasaIva)
        }, 0)
        
        // Envío: $50 si subtotal < $1000, gratis si >= $1000
        const envio = subtotal >= 1000 ? 0 : 50
        
        const total = subtotal + iva + envio
        
        return { subtotal, iva, envio, total }
    },
    
    get itemCount() {
        return get().items.reduce((count, item) => count + item.cantidad, 0)
    },
}))

export { useCartStore }
export default useCartStore
