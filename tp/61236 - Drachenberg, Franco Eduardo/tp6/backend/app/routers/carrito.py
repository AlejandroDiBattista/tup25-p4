from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_current_user, get_session
from app.models import Usuario
from app.schemas.carrito import CarritoRead, ItemCarritoCreate
from app.services.carrito import (
    CarritoCerradoError,
    ItemCarritoNoEncontradoError,
    ProductoNoEncontradoError,
    StockInsuficienteError,
    add_item_to_cart,
    get_cart_summary,
    remove_item_from_cart,
)

router = APIRouter(prefix="/carrito", tags=["Carrito"])


@router.get("", response_model=CarritoRead)
def obtener_carrito(
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_current_user),
) -> CarritoRead:
    return get_cart_summary(session, usuario.id)


@router.post("", response_model=CarritoRead, status_code=status.HTTP_201_CREATED)
def agregar_producto(
    payload: ItemCarritoCreate,
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_current_user),
) -> CarritoRead:
    try:
        return add_item_to_cart(session, usuario.id, payload.producto_id, payload.cantidad)
    except ProductoNoEncontradoError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))
    except (CarritoCerradoError, StockInsuficienteError) as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))


@router.delete("/{producto_id}", response_model=CarritoRead)
def eliminar_producto(
    producto_id: int,
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_current_user),
) -> CarritoRead:
    try:
        return remove_item_from_cart(session, usuario.id, producto_id)
    except ItemCarritoNoEncontradoError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))
    except CarritoCerradoError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))
