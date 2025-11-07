from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from models.database import engine
from models.carrito import Carrito, ItemCarrito
from models.productos import Producto

router = APIRouter()

@router.post("/carrito")
def agregar_al_carrito(usuario_id: int, producto_id: int):
    with Session(engine) as session:
       
        carrito = session.exec(select(Carrito).where(Carrito.usuario_id == usuario_id, Carrito.estado == "activo")).first()
        
        
        if not carrito:
            carrito = Carrito(usuario_id=usuario_id)
            session.add(carrito)
            session.commit()
            session.refresh(carrito)

        producto = session.get(Producto, producto_id)
        if not producto or producto.existencia <= 0:
            raise HTTPException(status_code=400, detail="Producto no disponible")

        item = session.exec(select(ItemCarrito).where(ItemCarrito.carrito_id == carrito.id, ItemCarrito.producto_id == producto_id)).first()
        if item:
            item.cantidad += 1
        else:
            item = ItemCarrito(carrito_id=carrito.id, producto_id=producto_id, cantidad=1)
            session.add(item)

        session.commit()
        return {"mensaje": "Producto agregado al carrito"}


@router.get("/carrito")
def ver_carrito(usuario_id: int):
    with Session(engine) as session:
        carrito = session.exec(select(Carrito).where(Carrito.usuario_id == usuario_id, Carrito.estado == "activo")).first()
        if not carrito:
            return {"productos": []}
        
        items = session.exec(select(ItemCarrito).where(ItemCarrito.carrito_id == carrito.id)).all()
        return items


@router.delete("/carrito/{producto_id}")
def quitar_producto(usuario_id: int, producto_id: int):
    with Session(engine) as session:
        carrito = session.exec(select(Carrito).where(Carrito.usuario_id == usuario_id, Carrito.estado == "activo")).first()
        if not carrito:
            raise HTTPException(status_code=400, detail="No hay carrito activo")

        item = session.exec(select(ItemCarrito).where(ItemCarrito.carrito_id == carrito.id, ItemCarrito.producto_id == producto_id)).first()
        if not item:
            raise HTTPException(status_code=404, detail="Producto no está en el carrito")

        session.delete(item)
        session.commit()
        return {"mensaje": "Producto eliminado del carrito"}