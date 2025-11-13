from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_session

router = APIRouter(prefix="/carrito", tags=["Carrito"])

# 🔹 Agregar producto al carrito
@router.post("/")
def agregar_al_carrito(item: schemas.CarritoItem, db: Session = Depends(get_session)):
    producto = db.query(models.Producto).get(item.producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    if producto.stock < item.cantidad:
        raise HTTPException(status_code=400, detail="Stock insuficiente")

    existente = (
        db.query(models.Carrito)
        .filter(models.Carrito.producto_id == item.producto_id, models.Carrito.finalizado == False)
        .first()
    )
    if existente:
        existente.cantidad += item.cantidad
    else:
        nuevo = models.Carrito(producto_id=item.producto_id, cantidad=item.cantidad)
        db.add(nuevo)

    db.commit()
    return {"message": "Producto agregado al carrito"}

# 🔹 Ver carrito
@router.get("/")
def ver_carrito(db: Session = Depends(get_session)):
    items = db.query(models.Carrito).filter(models.Carrito.finalizado == False).all()
    resultado = []
    total = 0
    for i in items:
        subtotal = i.cantidad * i.producto.precio
        resultado.append({
            "producto": i.producto.nombre,
            "cantidad": i.cantidad,
            "precio_unitario": i.producto.precio,
            "subtotal": subtotal
        })
        total += subtotal
    return {"carrito": resultado, "total_sin_iva": total}

# 🔹 Eliminar producto del carrito
@router.delete("/{producto_id}")
def eliminar_producto(producto_id: int, db: Session = Depends(get_session)):
    item = (
        db.query(models.Carrito)
        .filter(models.Carrito.producto_id == producto_id, models.Carrito.finalizado == False)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Producto no encontrado en el carrito")
    db.delete(item)
    db.commit()
    return {"message": "Producto eliminado del carrito"}

# 🔹 Cancelar compra
@router.post("/cancelar")
def cancelar_carrito(db: Session = Depends(get_session)):
    items = db.query(models.Carrito).filter(models.Carrito.finalizado == False).all()
    for item in items:
        db.delete(item)
    db.commit()
    return {"message": "Carrito cancelado y vaciado"}

# 🔹 Finalizar compra
@router.post("/finalizar")
def finalizar_compra(db: Session = Depends(get_session)):
    carrito = db.query(models.Carrito).filter(models.Carrito.finalizado == False).all()
    if not carrito:
        raise HTTPException(status_code=400, detail="Carrito vacío")

    total = 0
    detalle = []

    for item in carrito:
        producto = item.producto
        if producto.stock < item.cantidad:
            raise HTTPException(status_code=400, detail=f"Stock insuficiente de {producto.nombre}")
        producto.stock -= item.cantidad

        iva = 0.10 if producto.categoria.lower() == "electrónica" else 0.21
        subtotal = producto.precio * item.cantidad
        total_con_iva = subtotal * (1 + iva)
        detalle.append({
            "producto": producto.nombre,
            "cantidad": item.cantidad,
            "precio_unitario": producto.precio,
            "iva": iva,
            "subtotal": round(total_con_iva, 2)
        })
        total += total_con_iva
        item.finalizado = True

    envio = 0 if total > 1000 else 50
    total_final = total + envio

    compra = models.Compra(
        usuario_id=1,  # 🔸 pendiente: reemplazar con usuario autenticado
        total=round(total_final, 2),
        detalle={"productos": detalle, "envio": envio}
    )

    db.add(compra)
    db.commit()
    return {
        "message": "Compra finalizada con éxito",
        "total_final": total_final,
        "envio": envio,
        "detalle": detalle
    }