import {create} from "zustand"
import {persist} from "zustand/middleware"
import { Producto } from "../types"
import { eliminarProducto, cancelarCarrito, verCarrito } from "../services/carrito"
import { useAuthStore } from "./useAuthStore"

interface ItemCarrito {
    producto: Producto
    cantidad: number
}

interface CarritoState {
    items: ItemCarrito[]
    ver: (token: string) => Promise<void>
    agregar: (producto: Producto) => void
    disminuir: (id: number) => void
    eliminar: (id: number) => Promise<void>
    vaciar: () => Promise<void>
    limpiarLocal: () => void
}

export const useCarritoStore = create<CarritoState>() (
    persist (
        (set, get) => ({
            items: [],

            ver: async (token) => {
                try {
                    const data = await verCarrito(token)
                    if (data && Array.isArray(data.productos)) {
                        const items = data.productos.map((item: any) => ({
                            producto: item.producto || item,
                            cantidad: item.cantidad ?? 1
                        }))
                        set({items})
                    }
                } catch (error) {
                    console.error("Error al obtener el carrito: ", error)
                }
            },

            agregar: (producto) =>
                set((state) => {
                    const existente = state.items.find((i) => i.producto.id == producto.id)
                    if (existente) {
                        return {
                            items: state.items.map((i) =>
                            i.producto.id === producto.id ? {...i,  cantidad: i.cantidad + 1} : i
                            )
                        }
                    } else {
                        return {
                            items: [...state.items, {producto, cantidad: 1}]
                        }     
                    }
                }),

            disminuir: (id) =>
                set((state) => {
                    const existente = state.items.find((i) => i.producto.id === id)
                    if (!existente) return state

                    if (existente.cantidad <= 1) {
                        return {
                            items: state.items.filter((i) => i.producto.id !== id)
                        }
                    }
                    return {
                        items: state.items.map((i) => i.producto.id === id ? {...i, cantidad: i.cantidad - 1} : i)
                    }
                }),

            eliminar: async (id) => {
                const {token} = useAuthStore.getState()
                if (token) {
                    await eliminarProducto(id, token)
                }
                set((state) => ({
                    items: state.items.filter((i) => i.producto.id !== id)
                }))
            },

            vaciar: async () => {
                const {token} = useAuthStore.getState()
                if (token) {
                    await cancelarCarrito(token)
                }
                set({items: []})
            },
            
            limpiarLocal: () => {
                localStorage.removeItem("carrito-storage")
                set({items: []})
            }
        }),
        {
            name: "carrito-storage"
        }
    )
)