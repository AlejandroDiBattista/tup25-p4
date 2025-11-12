from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import json
from typing import Optional, List
from fastapi import Header, Depends, HTTPException, Request
import datetime

# Persistencia con SQLModel
from sqlmodel import SQLModel, create_engine, Session, select
from models.productos import Producto
from pathlib import Path as _Path

app = FastAPI(title="API Productos")

# --- Dependencia para leer el token (acepta header con/sin "Bearer" o query param "token") ---
def get_user_from_header(request: Request):
    # lee header (case-insensitive) o query param "token"
    auth = request.headers.get("authorization") or request.headers.get("Authorization")
    token = None
    if auth:
        # aceptar "Bearer <token>" o solo "<token>".
        # además, soportar accidentalmente repetidos como "Bearer Bearer <token>".
        if auth.lower().startswith("bearer "):
            # quitar uno o más prefijos "Bearer "
            token = auth
            # eliminar repetidos de forma segura
            while token.lower().startswith("bearer "):
                token = token.split(" ", 1)[1].strip()
        else:
            token = auth.strip()
    else:
        # fallback a query param 'token'
        token = request.query_params.get("token")
    # si no hay token -> devuelve None (dependencia no estricta)
    if not token:
        return None
    usuario = tokens.get(token)
    if not usuario:
        raise HTTPException(status_code=401, detail="Token inválido")
    return usuario

# Dependencia estricta: obliga a tener token válido (si no -> 401)
def get_user_strict(request: Request):
    user = get_user_from_header(request)
    if not user:
        raise HTTPException(status_code=401, detail="Token faltante")
    return user

# Montar imágenes estáticas
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- DATOS EN MEMORIA -----
usuarios = []
tokens = {}
carrito = {}
# compras por usuario: { email: [compra, ...], ...}
compras = {}
# lista global para buscar compras por id
purchases_by_id = []

# ----- FUNCIONES AUXILIARES -----
def cargar_productos():
    """Obtener productos desde la base de datos. Si la tabla está vacía,
    `init_db()` se encargó de poblarla desde el JSON.
    Como fallback lee el archivo JSON si por alguna razón la DB no está disponible.
    """
    try:
        with Session(engine) as session:
            productos_db = session.exec(select(Producto)).all()
            # convertir objetos SQLModel a diccionarios con claves esperadas
            productos = []
            for p in productos_db:
                productos.append({
                    "id": p.id,
                    "titulo": p.titulo,
                    "precio": p.precio,
                    "descripcion": p.descripcion,
                    "categoria": p.categoria,
                    "valoracion": p.valoracion,
                    "existencia": p.existencia,
                    "imagen": p.imagen,
                })
            return productos
    except Exception:
        ruta_productos = Path(__file__).parent / "productos.json"
        with open(ruta_productos, "r", encoding="utf-8") as archivo:
            return json.load(archivo)


# -------------------
# Base de datos
# -------------------
DB_PATH = _Path(__file__).parent / "database.db"
engine = create_engine(f"sqlite:///{DB_PATH}", echo=False)


def init_db():
    """Crear tablas y poblar productos desde productos.json si la tabla está vacía."""
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        productos_existentes = session.exec(select(Producto)).all()
        if len(productos_existentes) == 0:
            # poblar desde productos.json
            ruta_productos = Path(__file__).parent / "productos.json"
            try:
                with open(ruta_productos, "r", encoding="utf-8") as archivo:
                    datos = json.load(archivo)
            except Exception:
                datos = []
            for p in datos:
                prod = Producto(
                    id=p.get("id"),
                    titulo=p.get("titulo") or p.get("nombre") or "",
                    descripcion=p.get("descripcion", ""),
                    precio=p.get("precio", 0.0),
                    categoria=p.get("categoria", ""),
                    valoracion=p.get("valoracion", 0.0),
                    existencia=p.get("existencia", 0),
                    imagen=p.get("imagen", ""),
                )
                session.add(prod)
            session.commit()


# Inicializar DB al arrancar el módulo
init_db()

# ----- ENDPOINTS DE AUTENTICACIÓN -----

# Modelos de entrada/salida
from pydantic import BaseModel

class UsuarioRegistro(BaseModel):
    email: str
    password: str
    nombre: str = ""

class UsuarioLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

@app.post("/registrar")
def registrar_usuario(usuario: UsuarioRegistro):
    if any(u["email"] == usuario.email for u in usuarios):
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    usuarios.append({
        "email": usuario.email,
        "password": usuario.password,
        "nombre": usuario.nombre
    })
    return {"mensaje": "Usuario registrado correctamente"}

@app.post("/iniciar-sesion")
def iniciar_sesion(datos: UsuarioLogin):
    for u in usuarios:
        if u["email"] == datos.email and u["password"] == datos.password:
            token = f"token-{u['email']}"
            tokens[token] = u["email"]
            return TokenResponse(
                access_token=token,
                token_type="bearer"
            )
    raise HTTPException(status_code=401, detail="Credenciales inválidas")


@app.post("/cerrar-sesion")
async def cerrar_sesion(request: Request):
    # intenta leer token desde Authorization header (con/sin Bearer) o desde body JSON { "token": "..." }
    auth = request.headers.get("authorization") or request.headers.get("Authorization")
    token = None
    if auth:
        # reutilizar la misma lógica: quitar posibles repetidos "Bearer "
        token = auth
        while token.lower().startswith("bearer "):
            token = token.split(" ", 1)[1].strip()
    else:
        # probar query param 'token' y luego body
        token = request.query_params.get("token")
        if not token:
            try:
                data = await request.json()
                token = data.get("token")
            except Exception:
                token = None
    if token and token in tokens:
        del tokens[token]
        return {"mensaje": "Sesión cerrada correctamente"}
    raise HTTPException(status_code=400, detail="Token inválido")

# ----- ENDPOINTS DE PRODUCTOS -----
@app.get("/productos")
def obtener_productos(categoria: str = None, busqueda: str = None, buscar: str = None):
    # aceptar "buscar" como alias para compatibilidad con los tests
    if not busqueda and buscar:
        busqueda = buscar
    productos = cargar_productos()
    if categoria:
        productos = [p for p in productos if p["categoria"].lower() == categoria.lower()]
    if busqueda:
        productos = [p for p in productos if busqueda.lower() in p["nombre"].lower()]
    return productos

@app.get("/productos/{id}")
def obtener_producto(id: int):
    productos = cargar_productos()
    for p in productos:
        if p["id"] == id:
            return p
    raise HTTPException(status_code=404, detail="Producto no encontrado")

# ----- ENDPOINTS DEL CARRITO -----
@app.post("/carrito")
def agregar_al_carrito(datos: dict, auth_user: Optional[str] = Depends(get_user_from_header)):
    # Prioriza usuario autenticado por token; si no, usa "usuario" en el body
    usuario = auth_user or datos.get("usuario")
    producto_id = datos.get("producto_id")
    cantidad = datos.get("cantidad", 1)

    if not usuario or not producto_id:
        raise HTTPException(status_code=400, detail="Faltan datos: usuario o producto_id")

    if usuario not in carrito:
        carrito[usuario] = []

    carrito[usuario].append({"producto_id": producto_id, "cantidad": cantidad})
    return {"mensaje": "Producto agregado al carrito"}

@app.delete("/carrito/{product_id}")
def quitar_del_carrito(product_id: int, usuario: Optional[str] = None, auth_user: Optional[str] = Depends(get_user_from_header)):
    usuario = auth_user or usuario
    if not usuario:
        raise HTTPException(status_code=400, detail="Falta parámetro 'usuario' o token Authorization")
    if usuario not in carrito or not carrito[usuario]:
        raise HTTPException(status_code=404, detail="Carrito vacío")
    carrito[usuario] = [p for p in carrito[usuario] if p["producto_id"] != product_id]
    return {"mensaje": "Producto eliminado del carrito"}

from typing import Optional

@app.get("/carrito")
def ver_carrito(usuario: Optional[str] = None, auth_user: Optional[str] = Depends(get_user_from_header)):
    usuario = auth_user or usuario
    if usuario:
        return carrito.get(usuario, [])
    return carrito

# --- ENDPOINTS DE COMPRAS ---

@app.get("/compras")
def ver_compras(auth_user: str = Depends(get_user_strict)):
    # exigir token válido y devolver historial del usuario autenticado
    usuario = auth_user
    return compras.get(usuario, [])
  
@app.get("/compras/{id}")
def detalle_compra(id: int):
    # buscar en la lista global purchases_by_id por campo 'id'
    for c in purchases_by_id:
        if c.get("id") == id:
            return c
    raise HTTPException(status_code=404, detail="Compra no encontrada")
 
@app.post("/carrito/cancelar")
def cancelar_compra(auth_user: str = Depends(get_user_strict)):
    usuario = auth_user
    carrito[usuario] = []
    return {"mensaje": "Carrito vaciado"}

@app.post("/carrito/finalizar")
def finalizar_compra(payload: dict, auth_user: str = Depends(get_user_strict)):
    """
    payload debe contener al menos 'direccion' y 'tarjeta'.
    Se utiliza el usuario del token; si no hay token se devuelve 401.
    """
    usuario = auth_user
    direccion = payload.get("direccion")
    tarjeta = payload.get("tarjeta")
    if not direccion or not tarjeta:
        raise HTTPException(status_code=400, detail="Faltan datos de pago/envío")

    items = carrito.get(usuario, [])
    if not items:
        raise HTTPException(status_code=400, detail="Carrito vacío")

    # Calcular total simple (aquí se podría aplicar IVA/envío)
    total = 0
    productos = cargar_productos()
    prod_map = {p["id"]: p for p in productos}
    for it in items:
        pid = it["producto_id"]
        cantidad = it.get("cantidad", 1)
        precio = prod_map.get(pid, {}).get("precio", 0)
        total += precio * cantidad

    # Crear registro de compra
    new_id = len(purchases_by_id) + 1
    compra = {
        "id": new_id,
        "usuario": usuario,
        "items": items,
        "total": total,
        "direccion": direccion,
        "fecha": datetime.datetime.utcnow().isoformat()
    }
    purchases_by_id.append(compra)
    compras.setdefault(usuario, []).append(compra)

    # Vaciar carrito
    carrito[usuario] = []

    return {"compra_id": new_id, "mensaje": "Compra finalizada correctamente"}
# ----- ROOT -----
@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}

# ----- EJECUCIÓN LOCAL -----
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
