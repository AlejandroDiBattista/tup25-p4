"""
Servicio de lógica de negocio para el carrito de compras
"""
from sqlmodel import Session, select
from fastapi import HTTPException
from typing import Tuple

from models import Carrito, ItemCarrito, Producto, Usuario, EstadoCarrito


def obtener_o_crear_carrito_activo(usuario: Usuario, session: Session) -> Carrito:
    """
    Obtiene el carrito activo del usuario o crea uno nuevo si no existe.
    
    Args:
        usuario: Usuario actual
        session: Sesión de base de datos
        
    Returns:
        Carrito activo del usuario
    """
    # Buscar carrito activo
    statement = select(Carrito).where(
        Carrito.usuario_id == usuario.id,
        Carrito.estado == EstadoCarrito.ACTIVO
    )
    carrito = session.exec(statement).first()
    
    # Si no existe, crear uno nuevo
    if not carrito:
        carrito = Carrito(
            usuario_id=usuario.id,
            estado=EstadoCarrito.ACTIVO
        )
        session.add(carrito)
        session.commit()
        session.refresh(carrito)
        # Asegurar que items está inicializado
        if not hasattr(carrito, 'items') or carrito.items is None:
            carrito.items = []
    
    return carrito


def validar_existencia_producto(producto: Producto, cantidad: int) -> None:
    """
    Valida que haya existencia suficiente del producto.
    
    Args:
        producto: Producto a validar
        cantidad: Cantidad solicitada
        
    Raises:
        HTTPException 400: Si no hay existencia o es insuficiente
    """
    if producto.existencia <= 0:
        raise HTTPException(
            status_code=400,
            detail=f"El producto '{producto.titulo}' está agotado"
        )
    
    if producto.existencia < cantidad:
        raise HTTPException(
            status_code=400,
            detail=f"Stock insuficiente. Disponible: {producto.existencia}"
        )


def calcular_totales_carrito(carrito: Carrito) -> Tuple[float, float, float, float]:
    """
    Calcula los totales del carrito: subtotal, IVA, envío y total.
    
    Reglas:
    - IVA: 21% general, 10% para productos electrónicos
    - Envío: Gratis si total > $1000, sino $50
    
    Args:
        carrito: Carrito con items cargados
        
    Returns:
        Tupla (subtotal, iva, envio, total)
    """
    subtotal = 0.0
    iva = 0.0
    
    for item in carrito.items:
        item_subtotal = item.producto.precio * item.cantidad
        subtotal += item_subtotal
        
        # Calcular IVA según tipo de producto
        if item.producto.es_electronico:
            iva += item_subtotal * 0.10  # 10% para electrónicos
        else:
            iva += item_subtotal * 0.21  # 21% general
    
    # Calcular envío
    envio = 0.0 if subtotal > 1000 else 50.0
    
    # Total final
    total = subtotal + iva + envio
    
    return subtotal, iva, envio, total


def validar_carrito_activo(carrito: Carrito) -> None:
    """
    Valida que el carrito esté en estado ACTIVO.
    
    Args:
        carrito: Carrito a validar
        
    Raises:
        HTTPException 400: Si el carrito no está activo
    """
    if carrito.estado != EstadoCarrito.ACTIVO:
        raise HTTPException(
            status_code=400,
            detail="No se puede modificar un carrito finalizado o cancelado"
        )
