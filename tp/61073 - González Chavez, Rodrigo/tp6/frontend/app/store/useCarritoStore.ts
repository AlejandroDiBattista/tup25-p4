import {create} from "zustand"
import {persist} from "zustand/middleware"
import { Producto } from "../types"

interface ItemCarrito {
    producto: Producto
    cantidad: number
}

interface CarritoState {
    items: ItemCarrito[]
    agregar: (producto: Producto) => void
    disminuir: (id: number) => void
    eliminar: (id: number) => void
    vaciar: () => void
}

export const useCarritoStore = create<CarritoState>() (
    persist (
        (set) => ({
            items: [],

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

            eliminar: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.producto.id !== id)
                })),

            vaciar: () => set({items: []})
        }),
        {
            name: "carrito-storage"
        }
    )
)