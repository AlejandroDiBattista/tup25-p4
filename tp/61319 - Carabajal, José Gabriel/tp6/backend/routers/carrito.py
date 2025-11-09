from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import Annotated, List, Dict, Any
from datetime import datetime

from db import get_session
from models.carrito import Carrito, CarritoItem
from models.compras import Compra, CompraItem
from models.usuarios import Usuario
from schemas.cart import CartAddIn, CartView, CartViewItem, CartTotals, FinalizarCompraIn
from schemas.compras import CompraOut, CompraItemOut
from utils.products import cargar_productos

router = APIRouter(prefix="/carrito", tags=["carrito"])

# --- helpers ---
def get_or_create_cart(session: Session, usuario_id: int) -> Carrito:
    cart = session.exec(
        select(Carrito).where(Carrito.usuario_id == usuario_id, Carrito.estado == "abierto")
    ).first()
    if not cart:
        cart = Carrito(usuario_id=usuario_id, estado="abierto")
        session.add(cart)
        session.commit()
        session.refresh(cart)
    return cart

def buscar_producto(prod_list: List[Dict[str, Any]], producto_id: int) -> Dict[str, Any]:
    for p in prod_list:
        if int(p["id"]) == int(producto_id):
            return p
    raise HTTPException(status_code=404, detail="Producto no encontrado")

def calcular_totales(items: List[CartViewItem]) -> CartTotals:
    # IVA: 21% general, 10% si categoría es electrónica
    subtotal = sum(i.precio_unitario * i.cantidad for i in items)
    iva_total = 0.0
    for i in items:
        es_electro = "electr" in i.nombre.lower() or "electr" in i.nombre.lower()
        # Mejor por categoría si la tuviéramos aquí; como no viene, lo recalculamos en build_view usando categoría real.
    # Recalculamos en build_view con categoría real (ver abajo)
    # En esta función solo retornamos 0, se setea correctamente más abajo.
    return CartTotals(subtotal=subtotal, iva=0.0, envio=0.0, total=subtotal)

def build_cart_view(session: Session, cart: Carrito) -> CartView:
    productos = cargar_productos()
    view_items: List[CartViewItem] = []
    iva_sum = 0.0

    for it in cart.items:
        p = buscar_producto(productos, it.producto_id)
        precio = float(p["precio"])
        nombre = p["titulo"]
        categoria = p["categoria"]
        imagen = p["imagen"]

        # IVA por ítem
        tasa = 0.10 if "electr" in categoria.lower() else 0.21
        iva_sum += precio * it.cantidad * tasa

        view_items.append(
            CartViewItem(
                producto_id=it.producto_id,
                nombre=nombre,
                precio_unitario=precio,
                cantidad=it.cantidad,
                imagen=imagen,
            )
        )

    totals = calcular_totales(view_items)
    subtotal = totals.subtotal
    envio = 0.0 if subtotal > 1000 else 50.0
    total = subtotal + iva_sum + envio

    return CartView(
        estado=cart.estado,
        items=view_items,
        totals=CartTotals(subtotal=round(subtotal, 2), iva=round(iva_sum, 2), envio=round(envio, 2), total=round(total, 2)),
    )

# --- Endpoints ---

@router.get("", response_model=CartView)
def ver_carrito(usuario_id: int, session: Annotated[Session, Depends(get_session)]):
    cart = get_or_create_cart(session, usuario_id)
    return build_cart_view(session, cart)

@router.post("", response_model=CartView, status_code=201)
def agregar_al_carrito(data: CartAddIn, usuario_id: int, session: Annotated[Session, Depends(get_session)]):
    cart = get_or_create_cart(session, usuario_id)

    # buscar si ya existe el item
    item = session.exec(
        select(CarritoItem).where(CarritoItem.carrito_id == cart.id, CarritoItem.producto_id == data.producto_id)
    ).first()

    if item:
        item.cantidad += max(1, data.cantidad)
    else:
        item = CarritoItem(carrito_id=cart.id, producto_id=data.producto_id, cantidad=max(1, data.cantidad))
        session.add(item)

    session.commit()
    session.refresh(cart)
    return build_cart_view(session, cart)

@router.delete("/{producto_id}", response_model=CartView)
def quitar_del_carrito(producto_id: int, usuario_id: int, session: Annotated[Session, Depends(get_session)]):
    cart = get_or_create_cart(session, usuario_id)
    item = session.exec(
        select(CarritoItem).where(CarritoItem.carrito_id == cart.id, CarritoItem.producto_id == producto_id)
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="El producto no está en el carrito")
    session.delete(item)
    session.commit()
    return build_cart_view(session, cart)

@router.post("/cancelar", response_model=CartView)
def cancelar_carrito(usuario_id: int, session: Annotated[Session, Depends(get_session)]):
    cart = get_or_create_cart(session, usuario_id)
    cart.estado = "cancelado"
    # vaciar items
    for it in list(cart.items):
        session.delete(it)
    session.commit()
    return build_cart_view(session, cart)

@router.post("/finalizar", response_model=CompraOut)
def finalizar_compra(data: FinalizarCompraIn, usuario_id: int, session: Annotated[Session, Depends(get_session)]):
    cart = get_or_create_cart(session, usuario_id)
    if not cart.items:
        raise HTTPException(status_code=400, detail="El carrito está vacío")

    # construir vista para totales
    view = build_cart_view(session, cart)

    # crear compra
    compra = Compra(
        usuario_id=usuario_id,
        fecha=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        direccion=data.direccion,
        tarjeta=data.tarjeta[-4:],  # solo demo
        subtotal=view.totals.subtotal,
        iva=view.totals.iva,
        envio=view.totals.envio,
        total=view.totals.total,
    )
    session.add(compra)
    session.commit()
    session.refresh(compra)

    # items
    productos = cargar_productos()
    for it in cart.items:
        p = buscar_producto(productos, it.producto_id)
        session.add(CompraItem(
            compra_id=compra.id,
            producto_id=it.producto_id,
            nombre=p["titulo"],
            precio_unitario=float(p["precio"]),
            cantidad=it.cantidad
        ))

    # cerrar carrito y vaciar
    cart.estado = "finalizado"
    for it in list(cart.items):
        session.delete(it)
    session.commit()

    # respuesta
    return CompraOut(
        id=compra.id,
        fecha=compra.fecha,
        subtotal=compra.subtotal,
        iva=compra.iva,
        envio=compra.envio,
        total=compra.total,
        items=[
            CompraItemOut(
                producto_id=ci.producto_id,
                nombre=ci.nombre,
                precio_unitario=ci.precio_unitario,
                cantidad=ci.cantidad
            ) for ci in session.exec(select(CompraItem).where(CompraItem.compra_id == compra.id)).all()
        ]
    )
