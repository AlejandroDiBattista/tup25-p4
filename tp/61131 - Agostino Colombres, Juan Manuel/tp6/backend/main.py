import hashlib
import json
import secrets
from pathlib import Path
from typing import Dict

from fastapi import Cookie, Depends, FastAPI, Header, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from sqlmodel import Session, select

from database import create_db_and_tables, get_session
from models import Compra, CompraItem, Usuario


class CartItemPayload(BaseModel):
    producto_id: int
    cantidad: int


class CompraRequest(BaseModel):
    direccion: str
    tarjeta: str
    items: list[CartItemPayload]


class CompraResponse(BaseModel):
    id: int
    subtotal: float
    iva: float
    envio: float
    total: float


class CompraItemResponse(BaseModel):
    producto_id: int
    nombre: str
    precio_unitario: float
    cantidad: int
    categoria: str | None = None


class CompraDetalleResponse(BaseModel):
    id: int
    fecha: str
    direccion: str
    tarjeta: str
    subtotal: float
    iva: float
    envio: float
    total: float
    items: list[CompraItemResponse]

class RegistroRequest(BaseModel):
    nombre: str
    email: EmailStr
    password: str


class RegistroResponse(BaseModel):
    id: int
    nombre: str
    email: EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    nombre: str
    token_type: str = "bearer"


IVA_GENERAL = 0.21
IVA_ELECTRONICA = 0.10
ELECTRONICS_CATEGORY = "electrónica"
FREE_SHIPPING_THRESHOLD = 1000.0
SHIPPING_FLAT_COST = 50.0

# Tokens en memoria.
TOKENS: Dict[str, int] = {}

# Hash de la contraseña
def hash_password(password: str) -> str:
    """Devuelve un hash estable para la contraseña ingresada."""

    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, hashed_password: str) -> bool:
    return hash_password(password) == hashed_password


app = FastAPI(title="API Productos")

# Montar directorio de imágenes como archivos estáticos
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar productos desde el archivo JSON
def cargar_productos() -> list[dict]:
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)


def guardar_productos(productos: list[dict]) -> None:
    """Persiste el catálogo actualizado (por ejemplo, tras descontar stock)."""
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "w", encoding="utf-8") as archivo:
        json.dump(productos, archivo, ensure_ascii=False, indent=2)

# Registro de usuarios
@app.post("/registrar", response_model=RegistroResponse, status_code=status.HTTP_201_CREATED)
def registrar_usuario(
    payload: RegistroRequest,
    session: Session = Depends(get_session),
) -> RegistroResponse:
    """Crea un nuevo usuario con la contraseña hasheada."""

    existente = session.exec(select(Usuario).where(Usuario.email == payload.email)).first()
    if existente:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El email ya está registrado")

    usuario = Usuario(
        nombre=payload.nombre,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    session.add(usuario)
    session.commit()
    session.refresh(usuario)

    return RegistroResponse(id=usuario.id, nombre=usuario.nombre, email=usuario.email)

# Inicio de sesión
@app.post("/iniciar-sesion", response_model=TokenResponse)
def iniciar_sesion(
    payload: LoginRequest,
    response: Response,
    session: Session = Depends(get_session),
) -> TokenResponse:
    """Verifica credenciales y devuelve un token en memoria."""

    usuario = session.exec(select(Usuario).where(Usuario.email == payload.email)).first()
    if not usuario or not verify_password(payload.password, usuario.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")

    token = secrets.token_hex(32)
    TOKENS[token] = usuario.id

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24,
    )

    return TokenResponse(access_token=token, nombre=usuario.nombre)


def get_current_user(
    authorization: str | None = Header(default=None, alias="Authorization"),
    access_token: str | None = Cookie(default=None, alias="access_token"),
    session: Session = Depends(get_session),
) -> Usuario:
    token: str | None = None

    if authorization:
        scheme, _, candidate = authorization.partition(" ")
        if scheme.lower() == "bearer" and candidate:
            token = candidate
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

    if not token and access_token:
        token = access_token

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token faltante")

    usuario_id = TOKENS.get(token)
    if not usuario_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

    usuario = session.get(Usuario, usuario_id)
    if not usuario:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")

    return usuario


@app.post("/compras", response_model=CompraResponse, status_code=status.HTTP_201_CREATED)
def crear_compra(
    payload: CompraRequest,
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_current_user),
) -> CompraResponse:
    if not payload.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El carrito no puede estar vacío")

    productos_lista = cargar_productos()
    productos_por_id = {producto["id"]: producto for producto in productos_lista}

    subtotal = 0.0
    total_iva = 0.0
    items_a_guardar: list[CompraItem] = []

    for item in payload.items:
        producto = productos_por_id.get(item.producto_id)
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Producto con id {item.producto_id} no existe",
            )

        if item.cantidad < 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La cantidad debe ser al menos 1",
            )

        stock_disponible = int(producto.get("existencia", 0))
        if stock_disponible < item.cantidad:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No hay stock suficiente para {producto.get('titulo', 'producto')}",
            )

        precio_unitario = float(producto.get("precio", 0.0))
        item_subtotal = precio_unitario * item.cantidad
        subtotal += item_subtotal

        es_electronica = producto.get("categoria", "").strip().lower() == ELECTRONICS_CATEGORY
        tasa_iva = IVA_ELECTRONICA if es_electronica else IVA_GENERAL
        total_iva += item_subtotal * tasa_iva

        producto["existencia"] = stock_disponible - item.cantidad

        items_a_guardar.append(
            CompraItem(
                producto_id=item.producto_id,
                nombre=producto.get("titulo", ""),
                precio_unitario=precio_unitario,
                cantidad=item.cantidad,
            )
        )

    total_antes_envio = subtotal + total_iva
    envio = 0.0 if subtotal == 0.0 else (0.0 if total_antes_envio > FREE_SHIPPING_THRESHOLD else SHIPPING_FLAT_COST)
    total = total_antes_envio + envio

    compra = Compra(
        usuario_id=usuario.id,
        direccion=payload.direccion.strip(),
        tarjeta=payload.tarjeta.strip(),
        total=round(total, 2),
        envio=envio,
    )

    session.add(compra)
    session.flush()

    for compra_item in items_a_guardar:
        compra_item.compra_id = compra.id
        session.add(compra_item)

    session.commit()
    session.refresh(compra)

    guardar_productos(productos_lista)

    return CompraResponse(
        id=compra.id,
        subtotal=round(subtotal, 2),
        iva=round(total_iva, 2),
        envio=round(envio, 2),
        total=round(total, 2),
    )

# Listar compras del usuario actual
@app.get("/compras", response_model=list[CompraDetalleResponse])
def listar_compras(
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_current_user),
) -> list[CompraDetalleResponse]:
    productos = {producto["id"]: producto for producto in cargar_productos()}

    compras = session.exec(
        select(Compra)
        .where(Compra.usuario_id == usuario.id)
        .order_by(Compra.fecha.desc())
    ).all()

    compras_respuesta: list[CompraDetalleResponse] = []

    for compra in compras:
        compra_items = session.exec(
            select(CompraItem).where(CompraItem.compra_id == compra.id)
        ).all()

        subtotal = 0.0
        total_iva = 0.0
        items_respuesta: list[CompraItemResponse] = []

        for item in compra_items:
            precio_total_item = item.precio_unitario * item.cantidad
            subtotal += precio_total_item

            producto_catalogo = productos.get(item.producto_id)
            es_electronica = False
            if producto_catalogo:
                es_electronica = producto_catalogo.get("categoria", "").strip().lower() == ELECTRONICS_CATEGORY

            tasa_iva = IVA_ELECTRONICA if es_electronica else IVA_GENERAL
            total_iva += precio_total_item * tasa_iva

            items_respuesta.append(
                CompraItemResponse(
                    producto_id=item.producto_id,
                    nombre=item.nombre,
                    precio_unitario=item.precio_unitario,
                    cantidad=item.cantidad,
                    categoria=producto_catalogo.get("categoria") if producto_catalogo else None,
                )
            )

        envio_valor = float(compra.envio or 0.0)
        total_valor = float(compra.total or subtotal + total_iva + envio_valor)

        compras_respuesta.append(
            CompraDetalleResponse(
                id=compra.id,
                fecha=compra.fecha.isoformat(),
                direccion=compra.direccion,
                tarjeta=compra.tarjeta,
                subtotal=round(subtotal, 2),
                iva=round(total_iva, 2),
                envio=round(envio_valor, 2),
                total=round(total_valor, 2),
                items=items_respuesta,
            )
        )

    return compras_respuesta

# Evento de inicio
@app.on_event("startup")
def on_startup() -> None:
    """Inicializa la base de datos al arrancar la aplicación."""
    create_db_and_tables()
# Ruta raíz
@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}
# Listar productos con filtros
@app.get("/productos")
def obtener_productos(categoria: str | None = None, busqueda: str | None = None):
    productos = cargar_productos()

    if categoria:
        categoria_lower = categoria.lower()
        productos = [producto for producto in productos if producto.get("categoria", "").lower() == categoria_lower]

    if busqueda:
        termino = busqueda.lower()
        productos = [
            producto
            for producto in productos
            if termino in producto.get("titulo", "").lower()
            or termino in producto.get("descripcion", "").lower()
        ]

    return productos

# Obtener producto por ID
@app.get("/productos/{producto_id}")
def obtener_producto(producto_id: int):
    productos = cargar_productos()
    for producto in productos:
        if producto.get("id") == producto_id:
            return producto

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
