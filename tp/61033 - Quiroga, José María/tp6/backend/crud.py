# backend/crud.py
from sqlmodel import select, Session
from models import Usuario, Producto, Carrito, CarritoItem, Compra, CompraItem
from auth import hash_password
from database import get_engine
from typing import Optional, List

def crear_usuario(nombre: str, email: str, password: str):
    engine = get_engine()
    with Session(engine) as session:
        u = Usuario(nombre=nombre, email=email, hashed_password=hash_password(password))
        session.add(u)
        session.commit()
        session.refresh(u)
        return u

def obtener_usuario_por_email(email: str) -> Optional[Usuario]:
    engine = get_engine()
    with Session(engine) as session:
        return session.exec(select(Usuario).where(Usuario.email == email)).first()

def listar_productos(q: Optional[str] = None, categoria: Optional[str] = None) -> List[Producto]:
    engine = get_engine()
    with Session(engine) as session:
        query = select(Producto)
        if q:
            query = query.where(Producto.nombre.contains(q) | Producto.descripcion.contains(q))
        if categoria:
            query = query.where(Producto.categoria == categoria)
        return session.exec(query).all()

def obtener_producto(product_id: int) -> Optional[Producto]:
    engine = get_engine()
    with Session(engine) as session:
        return session.get(Producto, product_id)

def obtener_carrito_abierto(usuario_id: int) -> Optional[Carrito]:
    engine = get_engine()
    with Session(engine) as session:
        return session.exec(select(Carrito).where(Carrito.usuario_id == usuario_id, Carrito.estado == "abierto")).first()

def crear_carrito(usuario_id: int) -> Carrito:
    engine = get_engine()
    with Session(engine) as session:
        c = Carrito(usuario_id=usuario_id)
        session.add(c)
        session.commit()
        session.refresh(c)
        return c

def agregar_item_carrito(carrito_id: int, producto_id: int, cantidad: int):
    engine = get_engine()
    with Session(engine) as session:
        item = session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito_id, CarritoItem.producto_id == producto_id)).first()
        if item:
            item.cantidad += cantidad
            session.add(item)
        else:
            item = CarritoItem(carrito_id=carrito_id, producto_id=producto_id, cantidad=cantidad)
            session.add(item)
        session.commit()
        session.refresh(item)
        return item

def listar_items_carrito(carrito_id: int):
    engine = get_engine()
    with Session(engine) as session:
        return session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito_id)).all()

def eliminar_item_carrito(carrito_id: int, producto_id: int) -> bool:
    engine = get_engine()
    with Session(engine) as session:
        item = session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito_id, CarritoItem.producto_id == producto_id)).first()
        if item:
            session.delete(item)
            session.commit()
            return True
        return False
