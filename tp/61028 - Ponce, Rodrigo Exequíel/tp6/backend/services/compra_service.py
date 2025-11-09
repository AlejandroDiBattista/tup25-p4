from fastapi import HTTPException, status
from sqlmodel import Session, select
from models.models import Carrito, ItemCarrito, Producto, Usuario, Compra, ItemCompra
from services.carrito_service import CarritoService # Reutilizamos el servicio
from schemas.compra_schema import CompraCreate, CompraResumenResponse # <--- Importado
from datetime import datetime
from typing import List # <--- Importado

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
        # ¡IMPORTANTE! Refrescar el carrito para cargar los items antes de iterar
        session.refresh(carrito) 
        
        items_a_eliminar = list(carrito.items) # Crear una copia de la lista para iterar

        for item in items_a_eliminar:
            producto = session.get(Producto, item.producto_id)
            if not producto: # Chequeo por si el producto fue eliminado mientras estaba en el carrito
                 raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Producto con ID {item.producto_id} no encontrado durante la finalización")

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
    
    # --- Métodos para Commit 6 ---

    @staticmethod
    async def obtener_historial_compras(
        session: Session,
        usuario: Usuario
    ) -> List[CompraResumenResponse]:
        """
        Obtiene el historial de compras (resumen) del usuario.
        """
        query = select(Compra).where(Compra.usuario_id == usuario.id).order_by(Compra.fecha.desc())
        compras = session.exec(query).all()
        
        # Mapear al esquema de resumen
        resumenes = []
        for compra in compras:
            # Asegurarse de que los items estén cargados (pueden ser lazy-loaded)
            session.refresh(compra, ["items"]) 
            resumenes.append(
                CompraResumenResponse(
                    id=compra.id,
                    fecha=compra.fecha,
                    total=compra.total,
                    cantidad_items=len(compra.items) # Calcula la cantidad de items
                )
            )
        return resumenes

    @staticmethod
    async def obtener_detalle_compra(
        session: Session,
        usuario: Usuario,
        compra_id: int
    ) -> Compra:
        """
        Obtiene el detalle de una compra específica.
        Asegura que la compra pertenezca al usuario.
        """
        # SQLModel cargará automáticamente los 'items' gracias a la relación
        query = select(Compra).where(
            Compra.id == compra_id,
            Compra.usuario_id == usuario.id
        )
        compra = session.exec(query).first()
        
        if not compra:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Compra no encontrada o no pertenece al usuario"
            )
        
        # Refrescar para asegurarse de que los items estén cargados
        session.refresh(compra, ["items"])
        return compra