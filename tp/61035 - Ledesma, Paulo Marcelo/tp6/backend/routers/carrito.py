from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from datetime import datetime

from db import get_session
from models.usuario import Usuario
from models.producto import Producto
from models.carrito import Carrito, ItemCarrito
from models.compra import Compra, ItemCompra
from routers.auth import get_current_user

router = APIRouter()


# ✅ Obtener o crear carrito
def obtener_carrito(session: Session, usuario_id: int):
    carrito = session.exec(
        select(Carrito).where(
            Carrito.usuario_id == usuario_id,
            Carrito.estado == "activo"
        )
    ).first()

    if not carrito:
        carrito = Carrito(usuario_id=usuario_id, estado="activo")
        session.add(carrito)
        session.commit()
        session.refresh(carrito)

    return carrito


# ✅ Ver carrito
@router.get("/carrito")
def ver_carrito(
    current_user: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    carrito = obtener_carrito(session, current_user.id)

    items = session.exec(
        select(ItemCarrito).where(ItemCarrito.carrito_id == carrito.id)
    ).all()

    return {
        "carrito_id": carrito.id,
        "items": items
    }


# ✅ Agregar producto al carrito
@router.post("/carrito", status_code=201)
def agregar_producto(
    data: dict,
    current_user: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    producto_id = data.get("producto_id")
    cantidad = data.get("cantidad", 1)

    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(404, "Producto no encontrado")

    if producto.existencia < cantidad:
        raise HTTPException(400, "No hay suficiente stock")

    carrito = obtener_carrito(session, current_user.id)

    # Ver si ya está en el carrito
    item = session.exec(
        select(ItemCarrito).where(
            ItemCarrito.carrito_id == carrito.id,
            ItemCarrito.producto_id == producto_id
        )
    ).first()

    if item:
        item.cantidad += cantidad
    else:
        item = ItemCarrito(
            carrito_id=carrito.id,
            producto_id=producto_id,
            cantidad=cantidad
        )
        session.add(item)

    session.commit()
    return {"message": "Producto agregado al carrito"}


# ✅ Eliminar ítem del carrito
@router.delete("/carrito/{producto_id}")
def eliminar_item(
    producto_id: int,
    current_user: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    carrito = obtener_carrito(session, current_user.id)

    item = session.exec(
        select(ItemCarrito).where(
            ItemCarrito.carrito_id == carrito.id,
            ItemCarrito.producto_id == producto_id
        )
    ).first()

    if not item:
        raise HTTPException(404, "El producto no está en el carrito")

    session.delete(item)
    session.commit()

    return {"message": "Producto eliminado del carrito"}


# ✅ Cancelar compra (vaciar carrito)
@router.post("/carrito/cancelar")
def cancelar(
    current_user: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    carrito = obtener_carrito(session, current_user.id)

    items = session.exec(
        select(ItemCarrito).where(ItemCarrito.carrito_id == carrito.id)
    ).all()

    for item in items:
        session.delete(item)

    session.commit()
    return {"message": "Carrito cancelado"}


# ✅ Finalizar compra
@router.post("/carrito/finalizar")
def finalizar_compra(
    data: dict,
    current_user: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    direccion = data.get("direccion")
    tarjeta = data.get("tarjeta")

    carrito = obtener_carrito(session, current_user.id)

    items = session.exec(
        select(ItemCarrito).where(ItemCarrito.carrito_id == carrito.id)
    ).all()

    if not items:
        raise HTTPException(400, "El carrito está vacío")

    total = 0
    envio = 50

    compra = Compra(
        usuario_id=current_user.id,
        fecha=datetime.now(),
        direccion=direccion,
        tarjeta=tarjeta,
        total=0,
        envio=0
    )

    session.add(compra)
    session.commit()
    session.refresh(compra)

    for item in items:
        producto = session.get(Producto, item.producto_id)

        # Calcular impuesto
        if producto.categoria.lower().startswith("electro"):
            iva = 0.10
        else:
            iva = 0.21

        subtotal = (producto.precio * item.cantidad) * (1 + iva)
        total += subtotal

        # Restar stock
        producto.existencia -= item.cantidad

        # Guardar item de compra
        session.add(ItemCompra(
            compra_id=compra.id,
            producto_id=producto.id,
            cantidad=item.cantidad,
            nombre=producto.nombre,
            precio_unitario=producto.precio
        ))

        # Eliminar del carrito
        session.delete(item)

    if total > 1000:
        envio = 0

    compra.total = total
    compra.envio = envio

    carrito.estado = "finalizado"

    session.commit()

    return {"message": "Compra finalizada", "compra_id": compra.id}
