import { create } from 'zustand'
import { Producto } from '../types'

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
    addItem: (producto: Producto, cantidad: number) => void
    removeItem: (productoId: number) => void
    updateQuantity: (productoId: number, cantidad: number) => void
    clearCart: () => void
    getTotals: () => CartTotals
    itemCount: number
}

const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addItem: (producto, cantidad) => set((state) => {
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
    }),
    removeItem: (productoId) => set((state) => ({
        items: state.items.filter((item) => item.id !== productoId),
    })),
    updateQuantity: (productoId, cantidad) => set((state) => ({
        items: state.items.map((item) =>
            item.id === productoId ? { ...item, cantidad } : item
        ),
    })),
    clearCart: () => set({ items: [] }),
    getTotals: () => {
        const items = get().items
        const subtotal = items.reduce((total, item) => total + item.precio * item.cantidad, 0)
        
        // Calcular IVA según categoría (21% general, 10% electrónicos)
        const iva = items.reduce((total, item) => {
            const tasaIva = item.categoria === 'electronicos' ? 0.10 : 0.21
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

export default useCartStore
