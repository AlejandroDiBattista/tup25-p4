from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from db.database import engine
from models.carrito import Carrito
from models.productos import Producto
from utils.security import obtener_usuario_actual

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

