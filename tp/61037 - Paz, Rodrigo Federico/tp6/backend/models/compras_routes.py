from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from datetime import datetime
from models.database import engine
from models.carrito import Carrito, ItemCarrito
from models.productos import Producto
from models.compras import Compra, ItemCompra

router = APIRouter()

@router.post("/carrito/finalizar")
def finalizar_compra(usuario_id: int, direccion: str, tarjeta: str):
    with Session(engine) as session:
        
        carrito = session.exec(
            select(Carrito).where(Carrito.usuario_id == usuario_id, Carrito.estado == "activo")
        ).first()

        if not carrito:
            raise HTTPException(status_code=400, detail="No hay carrito activo para finalizar")

        items = session.exec(select(ItemCarrito).where(ItemCarrito.carrito_id == carrito.id)).all()

        if not items:
            raise HTTPException(status_code=400, detail="El carrito está vacío")

        subtotal = 0

        for item in items:

            producto = session.get(Producto, item.producto_id)

            if producto.existencia < item.cantidad:
                raise HTTPException(status_code=400, detail=f"No hay stock suficiente de {producto.nombre}")

            subtotal += producto.precio * item.cantidad
            producto.existencia -= item.cantidad

        iva = round(subtotal * 0.21, 2)
        envio = 0 if subtotal > 1000 else 50
        total = round(subtotal + iva + envio, 2)

        compra = Compra(
            usuario_id=usuario_id,
            fecha=datetime.now().strftime("%d/%m/%Y %H:%M"),
            direccion=direccion,
            tarjeta="****-****-****-" + tarjeta[-4:],  
            subtotal=subtotal,
            iva=iva,
            envio=envio,
            total=total,
        )

        session.add(compra)
        session.commit()
        session.refresh(compra)

        for item in items:
            producto = session.get(Producto, item.producto_id)
            item_compra = ItemCompra(
                compra_id=compra.id,
                nombre=producto.nombre,
                cantidad=item.cantidad,
                precio_unitario=producto.precio
            )
            session.add(item_compra)

        carrito.estado = "finalizado"
        session.commit()

        return {"mensaje": "Compra realizada con éxito", "total_pagado": total}
    
@router.get("/compras")
def ver_compras(usuario_id: int):
    with Session(engine) as session:
        compras = session.exec(
            select(Compra).where(Compra.usuario_id == usuario_id)
        ).all()
        return compras

@router.get("/compras/{compra_id}")
def detalle_compra(compra_id: int):
    with Session(engine) as session:
        compra = session.get(Compra, compra_id)
        if not compra:
            raise HTTPException(status_code=404, detail="Compra no encontrada")

        items = session.exec(
            select(ItemCompra).where(ItemCompra.compra_id == compra_id)
        ).all()

        return {
            "compra": compra,
            "items": items
        }