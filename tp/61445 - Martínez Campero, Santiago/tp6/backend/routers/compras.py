"""Endpoints para gestión de compras."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, and_
from datetime import datetime

from database import get_session
from models.compras import Compra, CompraCreate, CompraResponse, CompraDetailResponse, ItemCompra
from models.carrito import Carrito, ItemCarrito
from models.usuarios import Usuario
from models.productos import Producto
from utils import get_current_user
from config import IVA_STANDARD, IVA_ELECTRONICA, SHIPPING_COST, SHIPPING_FREE_THRESHOLD, ELECTRONICS_CATEGORIES

router = APIRouter(prefix="/compras", tags=["compras"])


@router.post("/finalizar", response_model=CompraResponse)
def finalizar_compra(
    compra_data: CompraCreate,
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_current_user)
):
    """Finalizar compra desde el carrito activo."""
    
    # Obtener carrito activo
    carrito = session.exec(
        select(Carrito).where(
            and_(
                Carrito.usuario_id == usuario.id,
                Carrito.estado == "activo"
            )
        )
    ).first()
    
    if not carrito:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active cart found"
        )
    
    # Obtener items del carrito
    items = session.exec(
        select(ItemCarrito).where(ItemCarrito.carrito_id == carrito.id)
    ).all()
    
    if not items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty"
        )
    
    # Calcular totales por categoría
    subtotal = 0.0
    iva_total = 0.0
    items_compra = []
    
    for item in items:
        producto = session.get(Producto, item.producto_id)
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product {item.producto_id} not found"
            )
        
        precio_item = producto.precio * item.cantidad
        subtotal += precio_item
        
        # Aplicar IVA según categoría
        iva_rate = IVA_ELECTRONICA if producto.categoria in ELECTRONICS_CATEGORIES else IVA_STANDARD
        iva_item = precio_item * iva_rate
        iva_total += iva_item
        
        # Crear item de compra
        item_compra = ItemCompra(
            producto_id=producto.id,
            cantidad=item.cantidad,
            nombre_producto=producto.nombre,
            precio_unitario=producto.precio
        )
        items_compra.append(item_compra)
    
    # Calcular envío
    envio = 0.0 if subtotal >= SHIPPING_FREE_THRESHOLD else SHIPPING_COST
    
    # Total final
    total = subtotal + iva_total + envio
    
    # Crear compra
    compra = Compra(
        usuario_id=usuario.id,
        direccion=compra_data.direccion,
        tarjeta=compra_data.tarjeta,
        subtotal=subtotal,
        iva=iva_total,
        envio=envio,
        total=total
    )
    
    session.add(compra)
    session.flush()  # Para obtener el ID
    
    # Asociar items
    for item_compra in items_compra:
        item_compra.compra_id = compra.id
        session.add(item_compra)
    
    # Marcar carrito como inactivo
    carrito.estado = "cancelado"
    carrito.fecha_cancelacion = datetime.utcnow()
    
    session.add(carrito)
    session.commit()
    session.refresh(compra)
    
    return compra


@router.get("", response_model=list[CompraResponse])
def obtener_compras(
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_current_user)
):
    """Obtener historial de compras del usuario."""
    
    compras = session.exec(
        select(Compra).where(Compra.usuario_id == usuario.id).order_by(Compra.fecha.desc())
    ).all()
    
    return compras


@router.get("/{compra_id}", response_model=CompraDetailResponse)
def obtener_compra(
    compra_id: int,
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_current_user)
):
    """Obtener detalles de una compra específica."""
    
    compra = session.get(Compra, compra_id)
    
    if not compra:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchase not found"
        )
    
    # Verificar que la compra pertenece al usuario
    if compra.usuario_id != usuario.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this purchase"
        )
    
    # Obtener items
    items = session.exec(
        select(ItemCompra).where(ItemCompra.compra_id == compra.id)
    ).all()
    
    return CompraDetailResponse(
        id=compra.id,
        usuario_id=compra.usuario_id,
        fecha=compra.fecha,
        direccion=compra.direccion,
        tarjeta=compra.tarjeta,
        subtotal=compra.subtotal,
        iva=compra.iva,
        envio=compra.envio,
        total=compra.total,
        estado=compra.estado,
        items=items
    )
