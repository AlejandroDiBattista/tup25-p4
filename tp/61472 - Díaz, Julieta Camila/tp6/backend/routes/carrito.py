from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from database import get_session
from models import (
    Usuario,
    Producto,
    Carrito,
    ItemCarrito,
    ItemCarritoRead
)
from security import get_current_user

router = APIRouter(prefix="/carrito", tags=["Carrito"])


def get_or_create_cart(session: Session, user_id: int):
    cart = session.exec(
        select(Carrito).where(
            Carrito.usuario_id == user_id,
            Carrito.estado == "activo"
        )
    ).first()

    if not cart:
        cart = Carrito(usuario_id=user_id, estado="activo")
        session.add(cart)
        session.commit()
        session.refresh(cart)

    return cart


@router.post("/", status_code=200)
async def add_to_cart(
    data: dict,
    session: Session = Depends(get_session),
    user: Usuario = Depends(get_current_user)
):
    producto_id = data["producto_id"]
    cantidad = data.get("cantidad", 1)

    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(404, "Producto no existe")

    if cantidad > producto.existencia:
        raise HTTPException(400, "No hay stock suficiente")

    cart = get_or_create_cart(session, user.id)

    item = session.exec(
        select(ItemCarrito).where(
            ItemCarrito.carrito_id == cart.id,
            ItemCarrito.producto_id == producto_id
        )
    ).first()

    if item:
        item.cantidad += cantidad
    else:
        item = ItemCarrito(
            carrito_id=cart.id,
            producto_id=producto_id,
            cantidad=cantidad
        )
        session.add(item)

    session.commit()
    return await get_cart(session, user)


@router.get("/", status_code=200)
async def get_cart(
    session: Session = Depends(get_session),
    user: Usuario = Depends(get_current_user)
):
    cart = get_or_create_cart(session, user.id)

    items = []
    subtotal = 0

    for item in cart.items_carrito:
        prod = item.producto
        total_prod = prod.precio * item.cantidad
        subtotal += total_prod

        items.append(ItemCarritoRead(
            producto_id=prod.id,
            nombre=prod.nombre,
            precio=prod.precio,
            cantidad=item.cantidad,
            imagen=prod.imagen
        ))

    iva = subtotal * 0.21
    envio = 0 if subtotal > 50 else 1000
    total = subtotal + iva + envio

    return {
        "items": items,
        "subtotal": subtotal,
        "iva": iva,
        "envio": envio,
        "total": total
    }