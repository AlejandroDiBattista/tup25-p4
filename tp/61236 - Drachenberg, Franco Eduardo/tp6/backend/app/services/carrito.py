from sqlmodel import Session, select

from app.models import Carrito, ItemCarrito, Producto
from app.schemas.carrito import CarritoRead, ItemCarritoRead


class CarritoCerradoError(Exception):
    pass


class ProductoNoEncontradoError(Exception):
    pass


class StockInsuficienteError(Exception):
    pass


def get_or_create_active_cart(session: Session, usuario_id: int) -> Carrito:
    statement = (
        select(Carrito)
        .where(Carrito.usuario_id == usuario_id, Carrito.estado == "abierto")
        .limit(1)
    )
    carrito = session.exec(statement).first()
    if carrito:
        return carrito

    carrito = Carrito(usuario_id=usuario_id)
    session.add(carrito)
    session.commit()
    session.refresh(carrito)
    return carrito


def build_cart_summary(session: Session, carrito: Carrito) -> CarritoRead:
    statement = (
        select(ItemCarrito, Producto)
        .join(Producto, ItemCarrito.producto_id == Producto.id)
        .where(ItemCarrito.carrito_id == carrito.id)
        .order_by(Producto.nombre)
    )
    items_data = session.exec(statement).all()

    items: list[ItemCarritoRead] = []
    total = 0.0

    for item, producto in items_data:
        subtotal = producto.precio * item.cantidad
        total += subtotal
        items.append(
            ItemCarritoRead(
                producto_id=producto.id,
                nombre=producto.nombre,
                precio=producto.precio,
                cantidad=item.cantidad,
                subtotal=round(subtotal, 2),
            )
        )

    return CarritoRead(
        id=carrito.id,
        estado=carrito.estado,
        total=round(total, 2),
        items=items,
    )


def get_cart_summary(session: Session, usuario_id: int) -> CarritoRead:
    carrito = get_or_create_active_cart(session, usuario_id)
    session.refresh(carrito)
    return build_cart_summary(session, carrito)


def add_item_to_cart(
    session: Session,
    usuario_id: int,
    producto_id: int,
    cantidad: int,
) -> CarritoRead:
    carrito = get_or_create_active_cart(session, usuario_id)
    session.refresh(carrito)

    if carrito.estado != "abierto":
        raise CarritoCerradoError("El carrito no está disponible para modificaciones")

    producto = session.get(Producto, producto_id)
    if not producto:
        raise ProductoNoEncontradoError("Producto no encontrado")

    if producto.existencia <= 0:
        raise StockInsuficienteError("El producto está agotado")

    item = session.get(ItemCarrito, (carrito.id, producto_id))
    nueva_cantidad = cantidad if item is None else item.cantidad + cantidad

    if nueva_cantidad > producto.existencia:
        raise StockInsuficienteError("No hay stock suficiente para la cantidad solicitada")

    if item is None:
        item = ItemCarrito(carrito_id=carrito.id, producto_id=producto_id, cantidad=cantidad)
        session.add(item)
    else:
        item.cantidad = nueva_cantidad

    session.commit()
    session.refresh(carrito)

    return build_cart_summary(session, carrito)
