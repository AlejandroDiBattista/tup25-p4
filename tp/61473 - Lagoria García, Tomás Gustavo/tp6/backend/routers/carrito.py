"""
Router de carrito de compras
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Annotated

from database import get_session
from models import (
    Usuario, Carrito, ItemCarrito, Producto,
    ItemCarritoCreate, ItemCarritoResponse, CarritoResponse, EstadoCarrito
)
from dependencies.auth import get_usuario_actual
from services.carrito_service import (
    obtener_o_crear_carrito_activo,
    validar_existencia_producto,
    calcular_totales_carrito,
    validar_carrito_activo
)

router = APIRouter(prefix="/carrito", tags=["Carrito"])


def construir_carrito_response(carrito: Carrito) -> CarritoResponse:
    """Helper para construir la respuesta del carrito."""
    subtotal, iva, envio, total = calcular_totales_carrito(carrito)
    
    return CarritoResponse(
        id=carrito.id,
        estado=carrito.estado,
        items=[
            ItemCarritoResponse(
                id=item.id,
                producto_id=item.producto_id,
                titulo=item.producto.titulo,
                precio=item.producto.precio,
                imagen=item.producto.imagen,
                cantidad=item.cantidad,
                subtotal=item.producto.precio * item.cantidad
            )
            for item in carrito.items
        ],
        subtotal=subtotal,
        iva=iva,
        envio=envio,
        total=total,
        cantidad_items=len(carrito.items),
        fecha_creacion=carrito.fecha_creacion,
        fecha_actualizacion=carrito.fecha_actualizacion
    )


@router.post("", response_model=CarritoResponse, status_code=201)
def agregar_producto_al_carrito(
    item_data: ItemCarritoCreate,
    usuario: Annotated[Usuario, Depends(get_usuario_actual)],
    session: Annotated[Session, Depends(get_session)]
):
    """
    Agrega un producto al carrito del usuario.
    
    Requiere autenticación.
    
    - **producto_id**: ID del producto a agregar
    - **cantidad**: Cantidad a agregar (debe haber existencia)
    
    Si el producto ya está en el carrito, incrementa la cantidad.
    """
    # Obtener o crear carrito activo
    carrito = obtener_o_crear_carrito_activo(usuario, session)
    
    # Buscar el producto
    producto = session.get(Producto, item_data.producto_id)
    if not producto:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )
    
    # Verificar existencia disponible
    # Si el producto ya está en el carrito, sumar la cantidad existente
    item_existente = session.exec(
        select(ItemCarrito).where(
            ItemCarrito.carrito_id == carrito.id,
            ItemCarrito.producto_id == item_data.producto_id
        )
    ).first()
    
    cantidad_total = item_data.cantidad
    if item_existente:
        cantidad_total += item_existente.cantidad
    
    validar_existencia_producto(producto, cantidad_total)
    
    # Si ya existe el item, actualizar cantidad
    if item_existente:
        item_existente.cantidad = cantidad_total
        session.add(item_existente)
    else:
        # Crear nuevo item
        nuevo_item = ItemCarrito(
            carrito_id=carrito.id,
            producto_id=item_data.producto_id,
            cantidad=item_data.cantidad
        )
        session.add(nuevo_item)
    
    session.commit()
    session.refresh(carrito)
    
    return construir_carrito_response(carrito)


@router.delete("/{producto_id}", response_model=CarritoResponse)
def quitar_producto_del_carrito(
    producto_id: int,
    usuario: Annotated[Usuario, Depends(get_usuario_actual)],
    session: Annotated[Session, Depends(get_session)]
):
    """
    Quita un producto del carrito.
    
    Requiere autenticación.
    Solo se puede quitar si el carrito está activo.
    """
    # Obtener carrito activo
    carrito = obtener_o_crear_carrito_activo(usuario, session)
    validar_carrito_activo(carrito)
    
    # Buscar el item en el carrito
    item = session.exec(
        select(ItemCarrito).where(
            ItemCarrito.carrito_id == carrito.id,
            ItemCarrito.producto_id == producto_id
        )
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado en el carrito"
        )
    
    # Eliminar el item
    session.delete(item)
    session.commit()
    session.refresh(carrito)
    
    return construir_carrito_response(carrito)


@router.get("", response_model=CarritoResponse)
def ver_carrito(
    usuario: Annotated[Usuario, Depends(get_usuario_actual)],
    session: Annotated[Session, Depends(get_session)]
):
    """
    Obtiene el contenido del carrito actual del usuario.
    
    Requiere autenticación.
    Muestra subtotal, IVA, envío y total.
    """
    # Obtener carrito activo
    carrito = obtener_o_crear_carrito_activo(usuario, session)
    
    return construir_carrito_response(carrito)


@router.post("/cancelar", status_code=204)
def cancelar_carrito(
    usuario: Annotated[Usuario, Depends(get_usuario_actual)],
    session: Annotated[Session, Depends(get_session)]
):
    """
    Cancela el carrito actual (vacía el carrito).
    
    Requiere autenticación.
    Cambia el estado a CANCELADO y elimina todos los items.
    """
    # Obtener carrito activo
    carrito = obtener_o_crear_carrito_activo(usuario, session)
    validar_carrito_activo(carrito)
    
    # Eliminar todos los items
    for item in carrito.items:
        session.delete(item)
    
    # Cambiar estado a cancelado
    carrito.estado = EstadoCarrito.CANCELADO
    session.add(carrito)
    session.commit()
    
    return None  # 204 No Content
