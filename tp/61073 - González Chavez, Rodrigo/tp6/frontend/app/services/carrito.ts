const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function verCarrito(token: string) {
    const response = await fetch(`${API_URL}/carrito`, {
        "headers": {
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error("Error al obtener el carrito")
    
    return await response.json()
}

export async function agregarAlCarrito(productoId: number, token: string) {
    const response = await fetch(`${API_URL}/carrito`, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        "body": JSON.stringify({producto_id: productoId, cantidad: 1})
    })

    if (!response.ok) throw new Error("Error al agregar producto al carrito")
    return response.json()
}

export async function procesarCarrito(token: string) {
    const response = await fetch (`${API_URL}/carrito/finalizar`, {
        "method": "POST",
        "headers": {
            Authorization: `Bearer ${token}`
        }
    })
    
    if (!response.ok) throw new Error ("Error al procesar el carrito")
    return response.json()
}

export async function eliminarProducto(productoId: number, token: string) {
    const response = await fetch(`${API_URL}/carrito/${productoId}`, {
        "method": "DELETE",
        "headers": {
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Error al eliminar del carrito: ${error}`)
    }

    return response.json()
}

export async function cancelarCarrito(token: string) {
    const response = await fetch(`${API_URL}/carrito/cancelar`, {
        "method": "POST",
        "headers": {
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Error al cancelar el carrito: ${error}`)
    }

    return response.json()
}