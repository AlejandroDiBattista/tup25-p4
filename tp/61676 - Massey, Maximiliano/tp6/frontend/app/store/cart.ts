import { create } from 'zustand'
import { Producto } from '../types'

interface CartItem extends Producto {
    cantidad: number
}

interface CartState {
    items: CartItem[]
    addItem: (producto: Producto, cantidad: number) => void
    removeItem: (productoId: number) => void
    updateQuantity: (productoId: number, cantidad: number) => void
    clearCart: () => void
    total: number
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
    get total() {
        return get().items.reduce((total, item) => total + item.precio * item.cantidad, 0)
    },
}))

export default useCartStore
