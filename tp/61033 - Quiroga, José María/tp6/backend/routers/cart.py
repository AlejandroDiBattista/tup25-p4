# backend/routers/cart.py
from fastapi import APIRouter, Depends, HTTPException
import crud, auth
from schemas import AddToCart, CheckoutData
from database import get_engine
from sqlmodel import Session, select
from models import Producto, Compra, CompraItem

router = APIRouter(prefix="/carrito", tags=["carrito"])

@router.post("")
def agregar(data: AddToCart, current_user=Depends(auth.get_current_user)):
    producto = crud.obtener_producto(data.product_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    if producto.existencia < data.cantidad:
        raise HTTPException(status_code=400, detail="Stock insuficiente")
    carrito = crud.obtener_carrito_abierto(current_user.id)
    if not carrito:
        carrito = crud.crear_carrito(current_user.id)
    item = crud.agregar_item_carrito(carrito.id, data.product_id, data.cantidad)
    return {"msg": "agregado", "item_id": item.id}

@router.delete("/{product_id}")
def quitar(product_id: int, current_user=Depends(auth.get_current_user)):
    carrito = crud.obtener_carrito_abierto(current_user.id)
    if not carrito:
        raise HTTPException(status_code=404, detail="Carrito no encontrado")
    ok = crud.eliminar_item_carrito(carrito.id, product_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    return {"msg": "eliminado"}

@router.get("")
def ver(current_user=Depends(auth.get_current_user)):
    carrito = crud.obtener_carrito_abierto(current_user.id)
    if not carrito:
        return {"items": [], "subtotal": 0, "iva": 0, "envio": 0, "total": 0}
    items = crud.listar_items_carrito(carrito.id)
    engine = get_engine()
    subtotal = 0.0
    iva = 0.0
    lista = []
    with Session(engine) as session:
        for it in items:
            p = session.get(Producto, it.producto_id)
            subtotal += p.precio * it.cantidad
            tasa = 0.10 if (p.categoria or "").lower() == "electronica" else 0.21
            iva += p.precio * it.cantidad * tasa
            lista.append({
                "producto_id": p.id,
                "nombre": p.nombre,
                "precio_unitario": p.precio,
                "cantidad": it.cantidad,
                "imagen": p.imagen,
                "disponible": p.existencia
            })
    envio = 0.0 if subtotal > 1000 else 50.0
    total = subtotal + iva + envio
    return {"items": lista, "subtotal": subtotal, "iva": iva, "envio": envio, "total": total}

@router.post("/finalizar")
def finalizar(payload: CheckoutData, current_user=Depends(auth.get_current_user)):
    carrito = crud.obtener_carrito_abierto(current_user.id)
    if not carrito:
        raise HTTPException(status_code=400, detail="Carrito vacío")
    items = crud.listar_items_carrito(carrito.id)
    if not items:
        raise HTTPException(status_code=400, detail="Carrito vacío")
    engine = get_engine()
    subtotal = 0.0
    iva = 0.0
    with Session(engine) as session:
        # validar stock y calcular
        for it in items:
            p = session.get(Producto, it.producto_id)
            if p.existencia < it.cantidad:
                raise HTTPException(status_code=400, detail=f"Stock insuficiente para {p.nombre}")
            subtotal += p.precio * it.cantidad
            tasa = 0.10 if (p.categoria or "").lower() == "electronica" else 0.21
            iva += p.precio * it.cantidad * tasa
        envio = 0.0 if subtotal > 1000 else 50.0
        total = subtotal + iva + envio
        # crear compra
        compra = Compra(usuario_id=current_user.id, direccion=payload.direccion, tarjeta=payload.tarjeta,
                        subtotal=subtotal, iva=iva, envio=envio, total=total)
        session.add(compra); session.commit(); session.refresh(compra)
        # crear items, restar stock y eliminar items carrito
        for it in items:
            p = session.get(Producto, it.producto_id)
            p.existencia -= it.cantidad
            session.add(p)
            comp_item = CompraItem(compra_id=compra.id, producto_id=p.id, cantidad=it.cantidad,
                                   nombre=p.nombre, precio_unitario=p.precio)
            session.add(comp_item)
            session.delete(it)
        carrito.estado = "finalizado"
        session.add(carrito)
        session.commit()
    return {"compra_id": compra.id, "total": total}

@router.post("/cancelar")
def cancelar(current_user=Depends(auth.get_current_user)):
    carrito = crud.obtener_carrito_abierto(current_user.id)
    if not carrito:
        return {"msg": "No había carrito abierto"}
    items = crud.listar_items_carrito(carrito.id)
    engine = get_engine()
    with Session(engine) as session:
        for it in items:
            session.delete(it)
        carrito.estado = "cancelado"
        session.add(carrito)
        session.commit()
    return {"msg": "Carrito cancelado"}
