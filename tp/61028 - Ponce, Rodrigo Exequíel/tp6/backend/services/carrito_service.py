from typing import Optional, List
from fastapi import HTTPException, status
from sqlmodel import Session, select
from models.models import Carrito, ItemCarrito, Producto, Usuario # <--- Import from models.models

class CarritoService:
    @staticmethod
    async def obtener_carrito_activo(session: Session, usuario: Usuario) -> Carrito: # <--- Cambiado a Carrito (no opcional)
        """Obtiene el carrito activo del usuario o crea uno nuevo si no existe"""
        query = select(Carrito).where(
            Carrito.usuario_id == usuario.id,
            Carrito.estado == "activo"
        )
        carrito = session.exec(query).first()
        
        if not carrito:
            carrito = Carrito(usuario_id=usuario.id, estado="activo")
            session.add(carrito)
            session.commit()
            session.refresh(carrito)
        
        return carrito

    @staticmethod
    async def agregar_producto(
        session: Session,
        usuario: Usuario,
        producto_id: int,
        cantidad: int
    ) -> ItemCarrito:
        """Agrega un producto al carrito"""
        # Verificar que el producto existe y tiene stock
        producto = session.get(Producto, producto_id)
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        
        # Regla: No se puede agregar si no hay existencias
        if producto.existencia <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Producto agotado"
            )
        
        if producto.existencia < cantidad:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No hay suficiente stock. Disponibles: {producto.existencia}"
            )

        # Obtener o crear carrito activo
        carrito = await CarritoService.obtener_carrito_activo(session, usuario)

        # Verificar si el producto ya está en el carrito
        query = select(ItemCarrito).where(
            ItemCarrito.carrito_id == carrito.id,
            ItemCarrito.producto_id == producto_id
        )
        item_existente = session.exec(query).first()

        if item_existente:
            # Actualizar cantidad
            nueva_cantidad = item_existente.cantidad + cantidad
            if nueva_cantidad > producto.existencia:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"No hay suficiente stock para agregar. Disponibles: {producto.existencia}, en carrito: {item_existente.cantidad}"
                )
            item_existente.cantidad = nueva_cantidad
            item = item_existente
        else:
            # Crear nuevo item
            item = ItemCarrito(
                carrito_id=carrito.id,
                producto_id=producto_id,
                cantidad=cantidad
            )
            session.add(item)

        session.commit()
        session.refresh(item)
        return item

    @staticmethod
    async def quitar_producto(
        session: Session,
        usuario: Usuario,
        producto_id: int
    ) -> bool: # <--- Cambiado a bool
        """Quita un producto del carrito. Devuelve True si se eliminó."""
        carrito = await CarritoService.obtener_carrito_activo(session, usuario)
        
        query = select(ItemCarrito).where(
            ItemCarrito.carrito_id == carrito.id,
            ItemCarrito.producto_id == producto_id
        )
        item = session.exec(query).first()
        
        if not item:
            # En lugar de lanzar 404, devolvemos False para que main.py lo maneje
            return False
        
        session.delete(item)
        session.commit()
        return True # <--- Devuelve True al tener éxito

    @staticmethod
    async def actualizar_cantidad(
        session: Session,
        usuario: Usuario,
        producto_id: int,
        cantidad: int
    ) -> ItemCarrito:
        """Actualiza la cantidad de un producto en el carrito"""
        
        # Regla: Si la cantidad es 0, quitar el producto
        if cantidad == 0:
            await CarritoService.quitar_producto(session, usuario, producto_id)
            # Devolver un item "fantasma" o manejarlo en el frontend
            # Para ser simple, lanzamos una excepción de que se debe borrar
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La cantidad no puede ser 0. Use el endpoint DELETE para eliminar."
            )

        carrito = await CarritoService.obtener_carrito_activo(session, usuario)
        
        # Verificar que el producto existe y tiene stock
        producto = session.get(Producto, producto_id)
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        
        if producto.existencia < cantidad:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No hay suficiente stock disponible. Disponibles: {producto.existencia}"
            )
        
        query = select(ItemCarrito).where(
            ItemCarrito.carrito_id == carrito.id,
            ItemCarrito.producto_id == producto_id
        )
        item = session.exec(query).first()
        
        if not item:
            raise HTTPException(
                status_code=status.HTTP_44_NOT_FOUND,
                detail="Producto no encontrado en el carrito"
            )
        
        item.cantidad = cantidad
        session.commit()
        session.refresh(item)
        return item

    @staticmethod
    async def obtener_carrito(
        session: Session,
        usuario: Usuario
    ) -> Carrito: # <--- Cambiado a Carrito (no opcional)
        """Obtiene el carrito activo con todos sus items y cálculos"""
        carrito = await CarritoService.obtener_carrito_activo(session, usuario)
        # Asegúrate de que tu esquema CarritoResponse esté cargando los items
        return carrito

    @staticmethod
    async def vaciar_carrito(
        session: Session,
        usuario: Usuario
    ) -> None:
        """Vacía el carrito del usuario (para cancelar compra)"""
        carrito = await CarritoService.obtener_carrito_activo(session, usuario)
        
        if not carrito.items:
            # El carrito ya está vacío
            return

        # Eliminar todos los items del carrito
        query = select(ItemCarrito).where(ItemCarrito.carrito_id == carrito.id)
        items = session.exec(query).all()
        for item in items:
            session.delete(item)
        
        # No cambiamos el estado, solo lo vaciamos.
        # Cambiar el estado a "cancelado" ocurrirá al finalizar o cancelar
        session.commit()