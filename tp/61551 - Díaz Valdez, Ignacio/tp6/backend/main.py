from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, PlainTextResponse, JSONResponse
import json
from pathlib import Path
from collections import OrderedDict

from db import create_db, get_session, engine
from models.productos import Producto
from sqlmodel import select
from auth import UsuarioCreate, create_access_token, authenticate_user, get_current_user, get_password_hash
from auth import Token as TokenSchema
from models.usuario import Usuario
from fastapi import Body, HTTPException, Depends, Request
from sqlalchemy.exc import IntegrityError


app = FastAPI(title="API Productos")

# Inicializar la base de datos al importar (crea tablas si no existen)
create_db()

# Montar directorio de imágenes como archivos estáticos
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def cargar_productos_desde_json():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)


@app.get("/")
def root(request: Request, format: str | None = None):
        """Raíz amigable: devuelve HTML por defecto, o JSON si el cliente lo pide.

        - HTML por defecto para navegadores.
        - JSON si: query ?format=json o cabecera Accept incluye application/json.
        """
        wants_json = (format == "json") or ("application/json" in request.headers.get("accept", ""))
        if wants_json:
                return {"mensaje": "API de Productos - use /productos para obtener el listado"}
        # HTML simple
        html = """
                <!doctype html>
                <html lang=es>
                    <head>
                        <meta charset=\"utf-8\" />
                        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
                        <title>API de Productos</title>
                        <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial;max-width:720px;margin:40px auto;padding:0 16px;line-height:1.5}</style>
                    </head>
                    <body>
                        <h1>API de Productos</h1>
                        <p>La API está funcionando.</p>
                        <ul>
                            <li><a href=\"/productos\">GET /productos</a></li>
                            <li><a href=\"/docs\">Swagger UI (/docs)</a></li>
                            <li><a href=\"/redoc\">ReDoc (/redoc)</a></li>
                            <li><a href=\"/?format=json\">Ver respuesta JSON</a></li>
                        </ul>
                    </body>
                </html>
        """
        return HTMLResponse(content=html)


@app.get("/productos")
def obtener_productos():
    """Intentar leer productos desde la base de datos; si no hay datos, hacer fallback al JSON original."""
    try:
        with get_session() as session:
            resultados = session.exec(select(Producto)).all()
            if resultados:
                # Orden deseado de claves (igual al JSON fuente):
                claves = [
                    "id",
                    "titulo",
                    "precio",
                    "descripcion",
                    "categoria",
                    "valoracion",
                    "existencia",
                    "imagen",
                ]
                lista = []
                for p in resultados:
                    # Soportar Pydantic/SQLModel v2 (model_dump) y v1 (dict)
                    try:
                        base = p.model_dump(exclude_none=True)  # type: ignore[attr-defined]
                    except AttributeError:
                        base = p.dict(exclude_none=True)  # v1 fallback
                    ordenado = OrderedDict()
                    for k in claves:
                        if k in base:
                            ordenado[k] = base[k]
                    # Incluir cualquier clave adicional al final (por compatibilidad futura)
                    for k, v in base.items():
                        if k not in ordenado:
                            ordenado[k] = v
                    lista.append(ordenado)
                return {"value": lista, "Count": len(lista)}
    except Exception:
        # cualquier problema con la BD -> fallback
        pass

    # Fallback al JSON, pero normalizando al formato { value, Count }
    try:
        lista = cargar_productos_desde_json()
        return {"value": lista, "Count": len(lista)}
    except Exception as e:
        # Si ni la BD ni el JSON funcionan, devolver error claro
        raise HTTPException(status_code=500, detail=f"No se pudieron obtener productos: {e}")



@app.post("/registrar", status_code=201)
def registrar_usuario(payload: UsuarioCreate = Body(...)):
    with get_session() as session:
        existing = session.exec(select(Usuario).where(Usuario.email == payload.email)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email ya registrado")
        # crear usuario (fuera del if para que se ejecute)
        nuevo = Usuario(
            email=payload.email,
            nombre=payload.nombre or "",
            password_hash=get_password_hash(payload.password),
        )
        session.add(nuevo)
        try:
            session.commit()
        except IntegrityError:
            # Protección extra ante condiciones de carrera o duplicados simultáneos
            session.rollback()
            raise HTTPException(status_code=400, detail="Email ya registrado")
        session.refresh(nuevo)
        return {"id": nuevo.id, "email": nuevo.email, "nombre": nuevo.nombre}


@app.post("/iniciar-sesion", response_model=TokenSchema)
def iniciar_sesion(form_data: dict = Body(...)):
    # espera JSON {"email":"...","password":"..."}
    email = form_data.get("email")
    password = form_data.get("password")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email y password requeridos")
    usuario = authenticate_user(email, password)
    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = create_access_token(subject=str(usuario.id))
    return {"access_token": token, "token_type": "bearer"}


@app.get("/me")
def me(current: Usuario = Depends(get_current_user)):
    return {"id": current.id, "email": current.email, "nombre": current.nombre}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

# Salud básica para diagnósticos rápidos
@app.get("/healthz", response_class=PlainTextResponse)
def healthz():
    return "ok"
