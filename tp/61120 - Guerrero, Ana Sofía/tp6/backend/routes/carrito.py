from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlmodel import Session, select
from typing import Optional

from models import Usuario, Carrito, Producto, ItemCarrito, Compra, ItemCompra
from schemas.schemas import CarritoResponse, CarritoConTotales, CompraCreate, CompraResponse
from database import get_session
from utils import get_current_user

router = APIRouter(prefix="/api/carrito", tags=["carrito"])


def _obtener_carrito_activo(usuario: Usuario, session: Session) -> Carrito:
    """Obtiene o crea el carrito activo del usuario"""
    carrito = session.exec(
        select(Carrito).where(
            (Carrito.usuario_id == usuario.id) & (Carrito.estado == "activo")
        )
    ).first()
    
    if not carrito:
        carrito = Carrito(usuario_id=usuario.id, estado="activo")
        session.add(carrito)
        session.commit()
        session.refresh(carrito)
    
    return carrito


def _calcular_totales(carrito: Carrito, session: Session) -> dict:
    """Calcula subtotal, IVA y envío"""
    subtotal = 0
    
    # Cargar items con productos
    session.refresh(carrito)
    
    for item in carrito.items:
        session.refresh(item)
        if item.producto:
            subtotal += item.producto.precio * item.cantidad
    
    # Calcular IVA (21% para productos normales, 10% para electrónicos)
    iva = 0
    for item in carrito.items:
        session.refresh(item)
        if item.producto:
            tasa_iva = 0.10 if item.producto.es_electronico else 0.21
            iva += (item.producto.precio * item.cantidad) * tasa_iva
    
    # Calcular envío
    envio = 0 if subtotal > 1000 else 50
    
    total = subtotal + iva + envio
    
    return {
        "subtotal": subtotal,
        "iva": iva,
        "envio": envio,
        "total": total
    }


@router.get("", response_model=CarritoConTotales)
def get_carrito(
    authorization: Optional[str] = Header(None),
    session: Session = Depends(get_session)
):
    """Obtiene el contenido del carrito del usuario"""
    usuario = get_current_user(authorization, session)
    carrito = _obtener_carrito_activo(usuario, session)
    
    totales = _calcular_totales(carrito, session)
    
    return {
        "id": carrito.id,
        "usuario_id": carrito.usuario_id,
        "estado": carrito.estado,
        "fecha_creacion": carrito.fecha_creacion,
        "items": carrito.items,
        **totales
    }


@router.post("")
def agregar_al_carrito(
    producto_id: int,
    cantidad: int = 1,
    authorization: Optional[str] = Header(None),
    session: Session = Depends(get_session)
):
    """Agrega un producto al carrito"""
    usuario = get_current_user(authorization, session)
    
    # Verificar que el producto existe
    producto = session.exec(
        select(Producto).where(Producto.id == producto_id)
    ).first()
    
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    # Verificar existencia
    if producto.existencia < cantidad:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No hay suficiente existencia. Disponibles: {producto.existencia}"
        )
    
    carrito = _obtener_carrito_activo(usuario, session)
    
    # Verificar si el producto ya está en el carrito
    item_existente = session.exec(
        select(ItemCarrito).where(
            (ItemCarrito.carrito_id == carrito.id) & 
            (ItemCarrito.producto_id == producto_id)
        )
    ).first()
    
    if item_existente:
        item_existente.cantidad += cantidad
    else:
        nuevo_item = ItemCarrito(
            carrito_id=carrito.id,
            producto_id=producto_id,
            cantidad=cantidad
        )
        session.add(nuevo_item)
    
    session.commit()
    
    return {"mensaje": "Producto agregado al carrito"}


@router.delete("/{producto_id}")
def quitar_del_carrito(
    producto_id: int,
    authorization: Optional[str] = Header(None),
    session: Session = Depends(get_session)
):
    """Quita un producto del carrito"""
    usuario = get_current_user(authorization, session)
    carrito = _obtener_carrito_activo(usuario, session)
    
    item = session.exec(
        select(ItemCarrito).where(
            (ItemCarrito.carrito_id == carrito.id) & 
            (ItemCarrito.producto_id == producto_id)
        )
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado en el carrito"
        )
    
    session.delete(item)
    session.commit()
    
    return {"mensaje": "Producto removido del carrito"}


@router.post("/finalizar")
def finalizar_compra(
    compra_data: CompraCreate,
    authorization: Optional[str] = Header(None),
    session: Session = Depends(get_session)
):
    """Finaliza la compra creando un registro en la tabla Compra"""
    usuario = get_current_user(authorization, session)
    carrito = _obtener_carrito_activo(usuario, session)
    
    if not carrito.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El carrito está vacío"
        )
    
    # Calcular totales
    totales = _calcular_totales(carrito, session)
    
    # Crear compra
    nueva_compra = Compra(
        usuario_id=usuario.id,
        direccion=compra_data.direccion,
        tarjeta=compra_data.tarjeta,
        subtotal=totales["subtotal"],
        iva=totales["iva"],
        envio=totales["envio"],
        total=totales["total"]
    )
    
    session.add(nueva_compra)
    session.flush()  # Para obtener el ID de la compra
    
    # Copiar items del carrito a la compra
    for item_carrito in carrito.items:
        session.refresh(item_carrito)
        producto = session.exec(
            select(Producto).where(Producto.id == item_carrito.producto_id)
        ).first()
        
        item_compra = ItemCompra(
            compra_id=nueva_compra.id,
            producto_id=item_carrito.producto_id,
            cantidad=item_carrito.cantidad,
            nombre=producto.nombre,
            precio_unitario=producto.precio
        )
        session.add(item_compra)
        
        # Reducir existencia del producto
        producto.existencia -= item_carrito.cantidad
    
    # Marcar carrito como finalizado y vaciar
    carrito.estado = "finalizado"
    for item in carrito.items:
        session.delete(item)
    
    session.commit()
    session.refresh(nueva_compra)
    
    return {
        "mensaje": "Compra finalizada exitosamente",
        "compra_id": nueva_compra.id,
        "total": nueva_compra.total
    }


@router.post("/cancelar")
def cancelar_compra(
    authorization: Optional[str] = Header(None),
    session: Session = Depends(get_session)
):
    """Cancela la compra (vacía el carrito)"""
    usuario = get_current_user(authorization, session)
    carrito = _obtener_carrito_activo(usuario, session)
    
    # Vaciar carrito
    for item in carrito.items:
        session.delete(item)
    
    session.commit()
    
    return {"mensaje": "Compra cancelada, carrito vaciado"}
