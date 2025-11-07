const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function agregarAlCarrito(productoId: number, token: string) {
    const response = await fetch(`${API_URL}/carrito`, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        "body": JSON.stringify({producto_id: productoId, cantidad: 1})
    })

    if (!response.ok)
        throw new Error("Error al agregar producto al carrito")
    
    return response.json()
}