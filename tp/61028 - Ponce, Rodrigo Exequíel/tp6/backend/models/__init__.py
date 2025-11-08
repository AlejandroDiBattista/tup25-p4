from .productos import Producto
from .models import Usuario, Carrito, ItemCarrito, Compra, ItemCompra

# Resolver referencias circulares
ItemCarrito.model_rebuild()
ItemCompra.model_rebuild()
Producto.model_rebuild()

__all__ = [
    "Producto",
    "Usuario",
    "Carrito",
    "ItemCarrito",
    "Compra",
    "ItemCompra",
]
