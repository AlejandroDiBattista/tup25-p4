# backend/app/crud.py
from sqlmodel import Session, select
from .models import Producto, Carrito, CarritoItem, Compra, CompraItem, User
from .auth import hash_password


IVA_GENERAL = 0.21
IVA_ELECTRONICA = 0.10




def buscar_productos(session: Session, q: str = None, categoria: str = None):
stmt = select(Producto)
if q:
stmt = stmt.where(Producto.nombre.contains(q) | Producto.descripcion.contains(q))
if categoria:
stmt = stmt.where(Producto.categoria == categoria)
return session.exec(stmt).all()




def agregar_al_carrito(session: Session, usuario: User, producto_id: int, cantidad: int):
producto = session.get(Producto, producto_id)
if not producto:
raise ValueError("Producto no encontrado")
if producto.existencia < cantidad:
raise ValueError("Producto agotado o cantidad insuficiente")
carrito = session.exec(select(Carrito).where(Carrito.usuario_id == usuario.id, Carrito.estado == "activo")).first()
if not carrito:
carrito = Carrito(usuario_id=usuario.id, estado="activo")
session.add(carrito)
session.commit()
session.refresh(carrito)
item = session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito.id, CarritoItem.producto_id == producto_id)).first()
if item:
item.cantidad += cantidad
else:
item = CarritoItem(carrito_id=carrito.id, producto_id=producto_id, cantidad=cantidad)
session.add(item)
session.commit()
session.refresh(item)
return item




def calcular_totales(session: Session, carrito: Carrito):
items = session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito.id)).all()
subtotal = 0.0
iva_total = 0.0
compra_items = []
for it in items:
prod = session.get(Producto, it.producto_id)
line_total = prod.precio * it.cantidad
iva_rate = IVA_ELECTRONICA if prod.categoria and "electron" in prod.categoria.lower() else IVA_GENERAL
iva_total += line_total * iva_rate
subtotal += line_total
compra_items.append((prod, it.cantidad))
envio = 0.0 if subtotal > 1000.0 else 50.0
total = subtotal + iva_total + envio
return {"subtotal": subtotal, "iva": iva_total, "envio": envio, "total": total, "items": compra_items}




def finalizar_compra(session: Session, usuario: User, direccion: str, tarjeta: str):
carrito = session.exec(select(Carrito).where(Carrito.usuario_id == usuario.id, Carrito.estado == "activo")).first()
if not carrito:
raise ValueError("Carrito vacío")
totals = calcular_totales(session, carrito)
for prod, cantidad in totals["items"]:
if prod.existencia < cantidad:
raise ValueError(f"Producto {prod.nombre} sin stock suficiente")
compra = Compra(usuario_id=usuario.id, direccion=direccion, tarjeta=tarjeta, total=totals["total"], envio=totals["envio"])
session.add(compra)
session.commit()
session.refresh(compra)
for prod, cantidad in totals["items"]:
ci = CompraItem(compra_id=compra.id, producto_id=prod.id, cantidad=cantidad, nombre=prod.nombre, precio_unitario=prod.precio)
session.add(ci)
prod.existencia -= cantidad
# marcar carrito finalizado y eliminar items
carrito.estado = "finalizado"
session.exec(select(CarritoIt