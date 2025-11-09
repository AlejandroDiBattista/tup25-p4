from fastapi import HTTPException, status
from sqlmodel import Session, select
from models.models import Carrito, ItemCarrito, Producto, Usuario, Compra, ItemCompra
from services.carrito_service import CarritoService # Reutilizamos el servicio
from schemas.compra_schema import CompraCreate
from datetime import datetime

class CompraService:
    @staticmethod
    async def finalizar_compra(
        session: Session,
        usuario: Usuario,
        datos_compra: CompraCreate
    ) -> Compra:
        
        # 1. Obtener el carrito activo
        carrito = await CarritoService.obtener_carrito_activo(session, usuario)
        if not carrito.items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El carrito está vacío"
            )

        subtotal = 0.0
        total_iva = 0.0
        
        # 2. Calcular totales y verificar stock final
        for item in carrito.items:
            # (Asegúrate de que tus 'items' tienen la relación 'producto' cargada)
            producto = session.get(Producto, item.producto_id)
            if not producto:
                 raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Producto con ID {item.producto_id} no encontrado")
            
            # Doble chequeo de stock (por si acaso)
            if producto.existencia < item.cantidad:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Stock insuficiente para '{producto.nombre}'"
                )
            
            precio_item = producto.precio * item.cantidad
            subtotal += precio_item

            # Regla de negocio: IVA
            if producto.categoria.lower() == "electrónicos": # Asume que la categoría se llama así
                total_iva += precio_item * 0.10
            else:
                total_iva += precio_item * 0.21

        # 3. Calcular envío
        costo_envio = 0.0
        # Regla de negocio: Envío
        if subtotal < 1000:
            costo_envio = 50.0
            
        # 4. Calcular Total Final
        total_final = subtotal + total_iva + costo_envio

        # 5. Crear el registro de Compra
        nueva_compra = Compra(
            usuario_id=usuario.id,
            fecha=datetime.now(),
            direccion=datos_compra.direccion,
            tarjeta=datos_compra.tarjeta, # En un caso real, hashear o guardar solo últimos 4
            total=total_final,
            envio=costo_envio
        )
        session.add(nueva_compra)
        session.commit()
        session.refresh(nueva_compra)

        # 6. Mover items del carrito a ItemsCompra y actualizar stock
        for item in carrito.items:
            producto = session.get(Producto, item.producto_id)
            
            # Crear el item de compra (para el historial)
            item_compra = ItemCompra(
                compra_id=nueva_compra.id,
                producto_id=producto.id,
                cantidad=item.cantidad,
                nombre=producto.nombre,
                precio_unitario=producto.precio
            )
            session.add(item_compra)
            
            # Regla de negocio: Actualizar stock
            producto.existencia -= item.cantidad
            session.add(producto)
            
            # Regla de negocio: Vaciar carrito
            session.delete(item) # Eliminar item del carrito

        # 7. Marcar el carrito como "finalizado"
        carrito.estado = "finalizado"
        session.add(carrito)
        
        session.commit()
        session.refresh(nueva_compra) # Cargar los items recién creados
        
        return nueva_compra