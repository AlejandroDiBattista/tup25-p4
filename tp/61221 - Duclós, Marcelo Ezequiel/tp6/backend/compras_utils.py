"""
Utilidades para el manejo de compras y finalización de carritos
"""
from decimal import Decimal, ROUND_HALF_UP
from typing import Tuple
from datetime import datetime
from sqlmodel import Session, select
from models import Carrito, ItemCarrito, Compra, ItemCompra, Producto, EstadoCarrito


def calcular_iva_y_total(subtotal: Decimal) -> Tuple[Decimal, Decimal]:
    """
    Calcula el IVA (21%) y total de una compra
    
    Args:
        subtotal: Subtotal sin IVA
        
    Returns:
        Tuple con (iva, total)
    """
    iva_porcentaje = Decimal('0.21')  # 21%
    iva = (subtotal * iva_porcentaje).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    total = subtotal + iva
    
    return iva, total


def calcular_envio(subtotal: Decimal) -> Decimal:
    """
    Calcula el costo de envío
    - Gratis si subtotal >= $1000
    - $150 si subtotal < $1000
    
    Args:
        subtotal: Subtotal de la compra
        
    Returns:
        Costo de envío
    """
    if subtotal >= Decimal('1000'):
        return Decimal('0')
    else:
        return Decimal('150')


def finalizar_compra(session: Session, carrito: Carrito) -> Compra:
    """
    Finaliza una compra convirtiendo el carrito en una compra
    
    Args:
        session: Sesión de base de datos
        carrito: Carrito a finalizar
        
    Returns:
        Compra creada
        
    Raises:
        ValueError: Si el carrito está vacío o no tiene stock suficiente
    """
    # Obtener items del carrito con productos
    items_carrito = session.exec(
        select(ItemCarrito).where(ItemCarrito.carrito_id == carrito.id)
    ).all()
    
    if not items_carrito:
        raise ValueError("El carrito está vacío")
    
    # Verificar stock disponible
    for item in items_carrito:
        producto = session.get(Producto, item.producto_id)
        if not producto:
            raise ValueError(f"Producto {item.producto_id} no encontrado")
        
        if producto.existencia < item.cantidad:
            raise ValueError(
                f"Stock insuficiente para {producto.titulo}. "
                f"Disponible: {producto.existencia}, Solicitado: {item.cantidad}"
            )
    
    # Calcular subtotal
    subtotal = Decimal('0')
    for item in items_carrito:
        producto = session.get(Producto, item.producto_id)
        subtotal += producto.precio * item.cantidad
    
    # Calcular envío, IVA y total
    envio = calcular_envio(subtotal)
    subtotal_con_envio = subtotal + envio
    iva, total = calcular_iva_y_total(subtotal_con_envio)
    
    # Crear la compra
    compra = Compra(
        usuario_id=carrito.usuario_id,
        subtotal=subtotal,
        envio=envio,
        iva=iva,
        total=total,
        fecha=datetime.utcnow(),
        direccion="Dirección de entrega",  # Placeholder
        tarjeta="**** 1234"  # Placeholder
    )
    session.add(compra)
    session.flush()  # Para obtener el ID de la compra
    
    # Crear items de compra y actualizar stock
    for item in items_carrito:
        producto = session.get(Producto, item.producto_id)
        
        # Crear item de compra
        item_compra = ItemCompra(
            compra_id=compra.id,
            producto_id=item.producto_id,
            cantidad=item.cantidad,
            nombre=producto.titulo,
            precio_unitario=producto.precio,
            categoria=producto.categoria
        )
        session.add(item_compra)
        
        # Actualizar stock del producto
        producto.existencia -= item.cantidad
    
    # Cambiar estado del carrito a FINALIZADO
    carrito.estado = EstadoCarrito.FINALIZADO
    carrito.fecha_actualizacion = datetime.utcnow()
    
    session.commit()
    
    return compra


def obtener_resumen_compra(session: Session, compra_id: int) -> dict:
    """
    Obtiene el resumen completo de una compra
    
    Args:
        session: Sesión de base de datos
        compra_id: ID de la compra
        
    Returns:
        Dict con toda la información de la compra
    """
    compra = session.get(Compra, compra_id)
    if not compra:
        raise ValueError("Compra no encontrada")
    
    # Obtener items de la compra
    items_compra = session.exec(
        select(ItemCompra).where(ItemCompra.compra_id == compra_id)
    ).all()
    
    # Construir respuesta con detalles de productos
    items_detalle = []
    for item in items_compra:
        producto = session.get(Producto, item.producto_id)
        items_detalle.append({
            "producto_id": item.producto_id,
            "titulo": producto.titulo,
            "cantidad": item.cantidad,
            "precio_unitario": float(item.precio_unitario),
            "subtotal": float(item.precio_unitario * item.cantidad)
        })
    
    return {
        "id": compra.id,
        "fecha_compra": compra.fecha.isoformat(),
        "subtotal": float(compra.subtotal),
        "envio": float(compra.envio),
        "iva": float(compra.iva),
        "total": float(compra.total),
        "items": items_detalle,
        "total_items": sum(item.cantidad for item in items_compra)
    }