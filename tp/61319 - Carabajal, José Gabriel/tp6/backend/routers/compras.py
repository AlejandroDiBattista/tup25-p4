from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import Annotated, List
from db import get_session
from models.compras import Compra, CompraItem
from schemas.compras import CompraOut, CompraItemOut

router = APIRouter(prefix="/compras", tags=["compras"])

@router.get("", response_model=List[CompraOut])
def listar_compras(usuario_id: int, session: Annotated[Session, Depends(get_session)]):
    compras = session.exec(select(Compra).where(Compra.usuario_id == usuario_id).order_by(Compra.id.desc())).all()
    res: List[CompraOut] = []
    for c in compras:
        items = session.exec(select(CompraItem).where(CompraItem.compra_id == c.id)).all()
        res.append(
            CompraOut(
                id=c.id,
                fecha=c.fecha,
                subtotal=c.subtotal,
                iva=c.iva,
                envio=c.envio,
                total=c.total,
                items=[
                    CompraItemOut(
                        producto_id=i.producto_id,
                        nombre=i.nombre,
                        precio_unitario=i.precio_unitario,
                        cantidad=i.cantidad,
                    ) for i in items
                ]
            )
        )
    return res
