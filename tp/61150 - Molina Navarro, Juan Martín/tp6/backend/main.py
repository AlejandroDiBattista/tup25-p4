from __future__ import annotations

import hashlib
import itertools
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Tuple

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, Field

RUTA_BASE = Path(__file__).parent
USUARIOS_PATH = RUTA_BASE / "usuarios.json"


def cargar_productos() -> List[Dict]:
    with (RUTA_BASE / "productos.json").open(encoding="utf-8") as archivo:
        return json.load(archivo)


def cargar_usuarios_desde_archivo() -> Tuple[Dict[str, Dict], itertools.count]:
    if not USUARIOS_PATH.exists():
        return {}, itertools.count(1)

    with USUARIOS_PATH.open(encoding="utf-8") as archivo:
        data = json.load(archivo)

    usuarios_por_email = {usuario["email"]: usuario for usuario in data}
    max_id = max((usuario["id"] for usuario in data), default=0)
    return usuarios_por_email, itertools.count(max_id + 1)


def guardar_usuarios_en_archivo() -> None:
    USUARIOS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with USUARIOS_PATH.open("w", encoding="utf-8") as archivo:
        json.dump(list(usuarios.values()), archivo, ensure_ascii=False, indent=2)


productos = cargar_productos()
catalogo_por_id = {producto["id"]: producto for producto in productos}

usuarios, secuencia_usuarios = cargar_usuarios_desde_archivo()
tokens_activos: Dict[str, str] = {}
carritos: Dict[str, Dict[int, int]] = {email: {} for email in usuarios}
compras: Dict[str, List[Dict]] = {email: [] for email in usuarios}
secuencia_compras = itertools.count(1)


def hashear_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def obtener_producto(producto_id: int) -> Dict:
    producto = catalogo_por_id.get(producto_id)
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return producto


def normalizar_texto(texto: str | None) -> str | None:
    if texto is None:
        return None
    return texto.strip().lower()


def calcular_detalle_carrito(email: str) -> Dict:
    items_carrito = carritos.get(email, {})
    items = []
    subtotal = 0.0
    iva = 0.0

    for producto_id, cantidad in items_carrito.items():
        producto = obtener_producto(producto_id)
        item_subtotal = producto["precio"] * cantidad
        tasa_iva = 0.10 if "electr" in producto["categoria"].lower() else 0.21
        iva += item_subtotal * tasa_iva
        subtotal += item_subtotal
        items.append(
            {
                "producto_id": producto_id,
                "titulo": producto["titulo"],
                "precio_unitario": producto["precio"],
                "cantidad": cantidad,
                "subtotal": round(item_subtotal, 2),
                "categoria": producto["categoria"],
                "imagen": producto["imagen"],
            }
        )

    base_para_envio = subtotal + iva
    envio = 0 if base_para_envio >= 1000 or base_para_envio == 0 else 50
    total = base_para_envio + envio

    return {
        "items": items,
        "subtotal": round(subtotal, 2),
        "iva": round(iva, 2),
        "envio": round(envio, 2),
        "total": round(total, 2),
    }


class RegistroRequest(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=64)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class CarritoItemRequest(BaseModel):
    producto_id: int
    cantidad: int = Field(..., gt=0)


class CarritoUpdateRequest(BaseModel):
    cantidad: int = Field(..., ge=0)


class CheckoutRequest(BaseModel):
    direccion: str = Field(..., min_length=6, max_length=200)
    tarjeta: str = Field(..., min_length=12, max_length=19)


app = FastAPI(title="API E-Commerce TP6")

# Montar directorio de imagenes como archivos estaticos
app.mount("/imagenes", StaticFiles(directory=RUTA_BASE / "imagenes"), name="imagenes")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


seguridad_bearer = HTTPBearer(auto_error=False)


def obtener_sesion(
    credenciales: HTTPAuthorizationCredentials = Depends(seguridad_bearer),
) -> Tuple[str, Dict]:
    if credenciales is None or credenciales.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token requerido")

    email = tokens_activos.get(credenciales.credentials)
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalido")

    return credenciales.credentials, usuarios[email]


def obtener_usuario_actual(sesion=Depends(obtener_sesion)):
    _, usuario = sesion
    return usuario


@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}


@app.get("/productos")
def obtener_productos(categoria: str | None = None, buscar: str | None = None):
    categoria_normalizada = normalizar_texto(categoria)
    termino = normalizar_texto(buscar)

    def coincide(producto: Dict) -> bool:
        coincide_categoria = True
        coincide_busqueda = True

        if categoria_normalizada:
            coincide_categoria = categoria_normalizada in producto["categoria"].lower()

        if termino:
            texto = f"{producto['titulo']} {producto['descripcion']}".lower()
            coincide_busqueda = termino in texto

        return coincide_categoria and coincide_busqueda

    return [producto for producto in productos if coincide(producto)]


@app.get("/productos/{producto_id}")
def obtener_producto_detalle(producto_id: int):
    return obtener_producto(producto_id)


@app.post("/registrar", status_code=status.HTTP_201_CREATED)
def registrar_usuario(payload: RegistroRequest):
    email = payload.email.lower()
    if email in usuarios:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El email ya esta registrado")

    usuario = {
        "id": next(secuencia_usuarios),
        "nombre": payload.nombre.strip(),
        "email": email,
        "password_hash": hashear_password(payload.password),
    }
    usuarios[email] = usuario
    carritos[email] = {}
    compras[email] = []
    guardar_usuarios_en_archivo()

    return {
        "mensaje": "Usuario registrado correctamente",
        "usuario": {"id": usuario["id"], "nombre": usuario["nombre"], "email": usuario["email"]},
    }


@app.post("/iniciar-sesion")
def iniciar_sesion(payload: LoginRequest):
    email = payload.email.lower()
    usuario = usuarios.get(email)
    if not usuario or usuario["password_hash"] != hashear_password(payload.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales invalidas")

    token = hashlib.sha256(f"{email}{datetime.now(timezone.utc)}".encode("utf-8")).hexdigest()
    tokens_activos[token] = email

    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {"id": usuario["id"], "nombre": usuario["nombre"], "email": usuario["email"]},
    }


@app.post("/cerrar-sesion")
def cerrar_sesion(sesion=Depends(obtener_sesion)):
    token, usuario = sesion
    tokens_activos.pop(token, None)
    return {"mensaje": "Sesion cerrada correctamente", "email": usuario["email"]}


@app.get("/carrito")
def ver_carrito(usuario=Depends(obtener_usuario_actual)):
    detalle = calcular_detalle_carrito(usuario["email"])
    return {"usuario": usuario["email"], **detalle}


@app.post("/carrito", status_code=status.HTTP_201_CREATED)
def agregar_producto_carrito(payload: CarritoItemRequest, usuario=Depends(obtener_usuario_actual)):
    producto = obtener_producto(payload.producto_id)
    if payload.cantidad > producto["existencia"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No hay existencia suficiente")

    carrito_usuario = carritos.setdefault(usuario["email"], {})
    nueva_cantidad = carrito_usuario.get(payload.producto_id, 0) + payload.cantidad

    if nueva_cantidad > producto["existencia"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cantidad solicitada supera el stock disponible")

    carrito_usuario[payload.producto_id] = nueva_cantidad
    detalle = calcular_detalle_carrito(usuario["email"])
    return {"mensaje": "Producto agregado al carrito", **detalle}


@app.delete("/carrito/{producto_id}")
def quitar_producto_carrito(producto_id: int, usuario=Depends(obtener_usuario_actual)):
    carrito_usuario = carritos.setdefault(usuario["email"], {})
    if producto_id not in carrito_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="El producto no esta en el carrito")

    carrito_usuario.pop(producto_id)
    return {"mensaje": "Producto eliminado del carrito", **calcular_detalle_carrito(usuario["email"])}


@app.patch("/carrito/{producto_id}")
def actualizar_producto_carrito(
    producto_id: int, payload: CarritoUpdateRequest, usuario=Depends(obtener_usuario_actual)
):
    carrito_usuario = carritos.setdefault(usuario["email"], {})

    if payload.cantidad == 0:
        carrito_usuario.pop(producto_id, None)
        return {"mensaje": "Producto eliminado del carrito", **calcular_detalle_carrito(usuario["email"])}

    producto = obtener_producto(producto_id)
    if payload.cantidad > producto["existencia"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cantidad solicitada supera el stock disponible"
        )

    carrito_usuario[producto_id] = payload.cantidad
    return {"mensaje": "Cantidad actualizada", **calcular_detalle_carrito(usuario["email"])}


@app.post("/carrito/cancelar")
def cancelar_carrito(usuario=Depends(obtener_usuario_actual)):
    carritos[usuario["email"]] = {}
    return {"mensaje": "Carrito cancelado", **calcular_detalle_carrito(usuario["email"])}


@app.post("/carrito/finalizar")
def finalizar_compra(payload: CheckoutRequest, usuario=Depends(obtener_usuario_actual)):
    carrito_usuario = carritos.get(usuario["email"], {})
    if not carrito_usuario:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El carrito esta vacio")

    for producto_id, cantidad in carrito_usuario.items():
        producto = obtener_producto(producto_id)
        if cantidad > producto["existencia"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Sin stock para {producto['titulo']}")

    detalle = calcular_detalle_carrito(usuario["email"])

    compra_id = next(secuencia_compras)
    compra = {
        "id": compra_id,
        "fecha": datetime.now(timezone.utc).isoformat(),
        "items": detalle["items"],
        "subtotal": detalle["subtotal"],
        "iva": detalle["iva"],
        "envio": detalle["envio"],
        "total": detalle["total"],
        "direccion": payload.direccion,
        "tarjeta_final": payload.tarjeta[-4:],
    }

    for producto_id, cantidad in carrito_usuario.items():
        catalogo_por_id[producto_id]["existencia"] -= cantidad

    compras.setdefault(usuario["email"], []).append(compra)
    carritos[usuario["email"]] = {}

    return {"mensaje": "Compra realizada con exito", "compra_id": compra_id, "total": detalle["total"]}


@app.get("/compras")
def listar_compras(usuario=Depends(obtener_usuario_actual)):
    return {"compras": compras.get(usuario["email"], [])}


@app.get("/compras/{compra_id}")
def obtener_compra(compra_id: int, usuario=Depends(obtener_usuario_actual)):
    historial = compras.get(usuario["email"], [])
    for compra in historial:
        if compra["id"] == compra_id:
            return compra
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compra no encontrada")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
