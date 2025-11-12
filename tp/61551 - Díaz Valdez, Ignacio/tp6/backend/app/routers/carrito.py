from fastapi import APIRouter, Depends, HTTPException, Body
from sqlmodel import select
from ..database import get_session
from ..models import Carrito, CarritoItem, Producto, Compra, CompraItem
from ..deps import get_current_user

router = APIRouter(prefix="/carrito", tags=["carrito"])

@router.get("")
def ver_carrito(current=Depends(get_current_user)):
    with get_session() as session:
        carrito = session.exec(select(Carrito).where(Carrito.usuario_id == current.id)).first()
        if not carrito:
            return {"items": [], "total": 0}
        total = 0
        detalles = []
        for it in carrito.items:
            if it.producto:
                subtotal = it.cantidad * it.producto.precio
                total += subtotal
                detalles.append({
                    "id": it.id,
                    "producto_id": it.producto_id,
                    "titulo": it.producto.titulo,
                    "cantidad": it.cantidad,
                    "precio": it.producto.precio,
                    "subtotal": subtotal,
                })
        return {"items": detalles, "total": total}

@router.post("/agregar")
def agregar_item(data: dict = Body(...), current=Depends(get_current_user)):
    producto_id = data.get("producto_id")
    cantidad = int(data.get("cantidad", 1))
    if not producto_id:
        raise HTTPException(status_code=400, detail="producto_id requerido")
    with get_session() as session:
        producto = session.get(Producto, producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no existe")
        carrito = session.exec(select(Carrito).where(Carrito.usuario_id == current.id)).first()
        if not carrito:
            carrito = Carrito(usuario_id=current.id)
            session.add(carrito)
            session.commit()
            session.refresh(carrito)
        # buscar item existente
        item = session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito.id, CarritoItem.producto_id == producto_id)).first()
        if item:
            item.cantidad += cantidad
        else:
            item = CarritoItem(carrito_id=carrito.id, producto_id=producto_id, cantidad=cantidad)
            session.add(item)
        session.commit()
        return {"message": "Item agregado", "item_id": item.id}

@router.post("/finalizar")
def finalizar_compra(current=Depends(get_current_user)):
    with get_session() as session:
        carrito = session.exec(select(Carrito).where(Carrito.usuario_id == current.id)).first()
        if not carrito or not carrito.items:
            raise HTTPException(status_code=400, detail="Carrito vacío")
        compra = Compra(usuario_id=current.id, total=0)
        session.add(compra)
        session.commit()
        session.refresh(compra)
        total = 0
        for it in carrito.items:
            if it.producto:
                subtotal = it.cantidad * it.producto.precio
                total += subtotal
                ci = CompraItem(compra_id=compra.id, producto_id=it.producto_id, cantidad=it.cantidad, precio_unitario=it.producto.precio)
                session.add(ci)
        compra.total = total
        # vaciar carrito
        for it in list(carrito.items):
            session.delete(it)
        session.commit()
        return {"compra_id": compra.id, "total": compra.total}

@router.post("/cancelar")
def cancelar_carrito(current=Depends(get_current_user)):
    with get_session() as session:
        carrito = session.exec(select(Carrito).where(Carrito.usuario_id == current.id)).first()
        if not carrito:
            return {"message": "Carrito inexistente"}
        for it in list(carrito.items):
            session.delete(it)
        session.commit()
        return {"message": "Carrito vaciado"}
