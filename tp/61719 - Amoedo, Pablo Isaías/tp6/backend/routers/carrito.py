from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from db.database import engine
from models.carrito import Carrito
from models.productos import Producto
from utils.security import obtener_usuario_actual
from models.compras import Compra

router = APIRouter()

@router.post("/carrito")
def agregar_al_carrito(producto_id: int, cantidad: int = 1, email: str = Depends(obtener_usuario_actual)):
    with Session(engine) as session:
        producto = session.get(Producto, producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        if producto.existencia < cantidad:
            raise HTTPException(status_code=400, detail="Stock insuficiente")

        item = Carrito(usuario_email=email, producto_id=producto_id, cantidad=cantidad)
        session.add(item)
        session.commit()
        session.refresh(item)
        return item

@router.get("/carrito")
def ver_carrito(usuario_email: str = Depends(obtener_usuario_actual)):
    with Session(engine) as session:
        items = session.exec(
            select(Carrito, Producto)
            .join(Producto, Producto.id == Carrito.producto_id)
            .where(Carrito.usuario_email == usuario_email)
        ).all()

        carrito = []
        for carrito_item, producto in items:
            carrito.append({
                "producto_id": producto.id,
                "nombre": producto.nombre,
                "precio_unitario": producto.precio,
                "cantidad": carrito_item.cantidad,
                "subtotal": carrito_item.cantidad * producto.precio
            })

        return {"carrito": carrito}
    
@router.post("/comprar")
def comprar(usuario_email: str = Depends(obtener_usuario_actual)):
    with Session(engine) as session:
        items = session.exec(
            select(Carrito, Producto)
            .join(Producto, Producto.id == Carrito.producto_id)
            .where(Carrito.usuario_email == usuario_email)
        ).all()

        if not items:
            raise HTTPException(status_code=400, detail="El carrito está vacío.")

        resumen = []
        for carrito_item, producto in items:
            if producto.existencia < carrito_item.cantidad:
                raise HTTPException(
                    status_code=400,
                    detail=f"No hay suficiente stock para el producto '{producto.nombre}'."
                )

            producto.existencia -= carrito_item.cantidad
            session.add(producto)

            # Registrar en historial
            compra = Compra(
                usuario_email=usuario_email,
                producto_id=producto.id,
                nombre_producto=producto.nombre,
                cantidad=carrito_item.cantidad,
                subtotal=carrito_item.cantidad * producto.precio
            )
            session.add(compra)


            resumen.append({
                "producto_id": producto.id,
                "nombre": producto.nombre,
                "cantidad": carrito_item.cantidad,
                "subtotal": carrito_item.cantidad * producto.precio
            })

            session.delete(carrito_item)

        session.commit()

        total = sum(item["subtotal"] for item in resumen)

        return {
            "mensaje": "Compra realizada con éxito.",
            "resumen": resumen,
            "total": total
        }

@router.delete("/carrito/{producto_id}")
def eliminar_producto_carrito(producto_id: int, usuario_email: str = Depends(obtener_usuario_actual)):
    with Session(engine) as session:
        item = session.exec(
            select(Carrito)
            .where(Carrito.usuario_email == usuario_email)
            .where(Carrito.producto_id == producto_id)
        ).first()

        if not item:
            raise HTTPException(status_code=404, detail="Producto no encontrado en el carrito.")

        session.delete(item)
        session.commit()

        return {"mensaje": f"Producto con ID {producto_id} eliminado del carrito."}
