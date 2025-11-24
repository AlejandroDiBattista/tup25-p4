from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime

from database import get_session
from models import (
    Usuario,
    Producto,
    Carrito,
    ItemCarrito,
    Compra,
    ItemCompra,
    CompraRead,
    ItemCompraRead
)
from security import get_current_user

router = APIRouter(prefix="/compras", tags=["Compras"])


# ============================================================
# GET /compras → Lista de compras del usuario
# ============================================================
@router.get("/", response_model=List[CompraRead])
async def get_compras(
    session: Session = Depends(get_session),
    user: Usuario = Depends(get_current_user)
):
    compras = session.exec(
        select(Compra).where(Compra.usuario_id == user.id)
    ).all()

    result = []
    for compra in compras:
        items = [
            ItemCompraRead(
                nombre=i.nombre,
                cantidad=i.cantidad,
                precio_unitario=i.precio_unitario
            )
            for i in compra.items_compra
        ]

        result.append(
            CompraRead(
                id=compra.id,
                fecha=compra.fecha,
                direccion=compra.direccion,
                tarjeta=compra.tarjeta,
                total=compra.total,
                envio=compra.envio,
                items=items
            )
        )

    return result


# ============================================================
# GET /compras/{id} → Detalle de una compra
# ============================================================
@router.get("/{compra_id}", response_model=CompraRead)
async def get_compra_detalle(
    compra_id: int,
    session: Session = Depends(get_session),
    user: Usuario = Depends(get_current_user)
):
    compra = session.exec(
        select(Compra).where(
            Compra.id == compra_id,
            Compra.usuario_id == user.id
        )
    ).first()

    if not compra:
        raise HTTPException(status_code=404, detail="Compra no encontrada")

    items = [
        ItemCompraRead(
            nombre=i.nombre,
            cantidad=i.cantidad,
            precio_unitario=i.precio_unitario
        )
        for i in compra.items_compra
    ]

    return CompraRead(
        id=compra.id,
        fecha=compra.fecha,
        direccion=compra.direccion,
        tarjeta=compra.tarjeta,
        total=compra.total,
        envio=compra.envio,
        items=items
    )


# ============================================================
# POST /compras/finalizar → Finalizar compra + descontar stock
# ============================================================
@router.post("/finalizar")
async def finalizar_compra(
    direccion: str,
    tarjeta: str,
    session: Session = Depends(get_session),
    user: Usuario = Depends(get_current_user)
):
    # Obtener carrito activo
    carrito = session.exec(
        select(Carrito).where(
            Carrito.usuario_id == user.id,
            Carrito.estado == "activo"
        )
    ).first()

    if not carrito or not carrito.items_carrito:
        raise HTTPException(status_code=400, detail="El carrito está vacío.")

    subtotal = 0
    iva_total = 0
    envio = 50.0

    # Validación de stock + cálculo
    for item in carrito.items_carrito:
        producto = session.get(Producto, item.producto_id)

        if producto.existencia < item.cantidad:
            raise HTTPException(
                status_code=400,
                detail=f"Stock insuficiente para {producto.titulo}"
            )

        subtotal += producto.precio * item.cantidad
        iva_total += (producto.precio * 0.21) * item.cantidad

    total = subtotal + iva_total + envio

    # Crear compra
    nueva_compra = Compra(
        usuario_id=user.id,
        fecha=str(datetime.now()),
        direccion=direccion,
        tarjeta=tarjeta[-4:],  # últimos dígitos
        total=total,
        envio=envio
    )

    session.add(nueva_compra)
    session.commit()
    session.refresh(nueva_compra)

    # Crear items + actualizar stock
    for item in carrito.items_carrito:
        producto = session.get(Producto, item.producto_id)

        # 🔥 DESCONTAR STOCK
        producto.existencia -= item.cantidad
        session.add(producto)

        nuevo_item = ItemCompra(
            compra_id=nueva_compra.id,
            producto_id=producto.id,
            cantidad=item.cantidad,
            nombre=producto.titulo,
            precio_unitario=producto.precio
        )

        session.add(nuevo_item)

    # Cerrar carrito actual
    carrito.estado = "cerrado"
    session.add(carrito)

    # Crear nuevo carrito vacío
    nuevo_carrito = Carrito(usuario_id=user.id, estado="activo")
    session.add(nuevo_carrito)

    session.commit()

    return {
        "mensaje": "Compra finalizada correctamente",
        "total": total
    }