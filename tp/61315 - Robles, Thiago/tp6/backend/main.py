from fastapi import FastAPI,Query,Path, Body, HTTPException,status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from sqlmodel import SQLModel, Session, create_engine, select
from sqlalchemy import or_
from pydantic import BaseModel

from typing import Optional

import json
from pathlib import Path as PathlibPath

from models.usuario import Usuario
from models.producto import Producto
from models.compra import Compras, CompraItem
from models.carrito import Carrito, CarritoItem

import secrets




BASE_DIR = PathlibPath(__file__).resolve().parent
DB_PATH = BASE_DIR / "parcialdatabase.db"
SEED_PATH = BASE_DIR / "productos.json"

engine = create_engine(f"sqlite:///{DB_PATH}", echo=True)

app = FastAPI(title="API Productos")

def crear_db ():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        productos = session.exec(select(Producto)).all()
        if not productos:
            with open(SEED_PATH, "r", encoding="utf-8") as archivo:
                datos_productos = json.load(archivo)
                for item in datos_productos:
                    producto = Producto(**item)
                    session.add(producto)
                session.commit()

@app.on_event("startup")
def on_startup():
    crear_db()
    



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

# Cargar productos desde el archivo JSON
def cargar_productos():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)



@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}

# Endpoints de Auth
session_tokens: dict [str,int] = {}

class UsuarioCreate(BaseModel):
    nombre: str
    email: str
    contraseña: str
    
    

@app.post("/registrar")
def registrar_usuario(usuario: UsuarioCreate):
    with Session(engine) as session:
        nuevo_usuario = Usuario(**usuario.dict())
        session.add(nuevo_usuario)
        session.commit()
        session.refresh(nuevo_usuario)
        return nuevo_usuario

@app.post("/iniciar-sesion")
def iniciar_sesion(usuario: UsuarioCreate):
    with Session(engine) as session:
        usuario_db = session.exec(
            select(Usuario).where(
                or_(
                    Usuario.nombre == usuario.nombre,
                    Usuario.email == usuario.email,
                )
            )
        ).first()
        if not usuario_db or usuario_db.contraseña != usuario.contraseña:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
        token = secrets.token_urlsafe(32)
        session_tokens[token] = usuario_db.id
        return {"access_token": token, "token_type": "bearer"}

@app.post("/cerrar-sesion")
def cerrar_sesion(token: str = Body(..., embed=True)):
    usuario_id = session_tokens.pop(token, None)
    if not usuario_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
    return {"mensaje": "Sesión cerrada", "usuario_id": usuario_id}


# Endpoints de Productos

@app.get("/productos/", response_model=list[Producto])

def obtener_productos(categoria: Optional[str] = Query(None,description="Filtrar por categoria"),
    buscar: Optional[str] = Query(None,description="Buscar por nombre")):
    with Session(engine) as session:
        query = select(Producto)
        if categoria:
            query = query.where(Producto.categoria == categoria)
        if buscar:
            query = query.where(Producto.titulo.ilike(f"%{buscar}%"))
        productos = session.exec(query).all()
        return productos

@app.get("/productos/{id}")
def obtener_producto(id: int):
    with Session(engine) as session:
        producto = session.get(Producto, id)
        if producto:
            return producto
        return {"mensaje": "Producto no encontrado"}, 404


# Endpoints de Carrito

class CarritoItemCreate(BaseModel):
    usuario_id: int | None = None
    producto_id: int
    cantidad: int 

@app.post("/carrito", response_model=CarritoItem)
def agregar_al_carrito(payload: CarritoItemCreate = Body(...)):
    with Session(engine) as session:
        carrito = session.exec(
            select(Carrito).where(Carrito.usuario_id == payload.usuario_id)
        ).first()
        if not carrito:
            carrito = Carrito(usuario_id=payload.usuario_id)
            session.add(carrito)
            session.commit()
            session.refresh(carrito)

        item = session.exec(
            select(CarritoItem)
            .where(CarritoItem.carrito_id == carrito.id)
            .where(CarritoItem.producto_id == payload.producto_id)
        ).first()

        if item:
            item.cantidad += payload.cantidad
        else:
            item = CarritoItem(
                carrito_id=carrito.id,
                producto_id=payload.producto_id,
                cantidad=payload.cantidad,
            )
            session.add(item)

        session.commit()
        session.refresh(item)
        return item

# Eliminar carrito e insertar compra correspondiente
@app.delete("/carrito/{producto_id}")
def eliminar_del_carrito(
    producto_id: int = Path(..., description="ID del producto a eliminar"),
    usuario_id: int = Query(..., description="ID del usuario")
   
):
    with Session(engine) as session:
        carrito = session.exec(
            select(Carrito).where(Carrito.usuario_id == usuario_id)
        ).first()

        if not carrito:
            return {"mensaje": "Carrito no encontrado"}, 404

        item = session.exec(
            select(CarritoItem)
            .where(CarritoItem.carrito_id == carrito.id)
            .where(CarritoItem.producto_id == producto_id)
        ).first()

        if not item:
            return {"mensaje": "Producto no encontrado en el carrito"}, 404

        session.delete(item)
        session.commit()
        return {"mensaje": "Producto eliminado del carrito"}
    


@app.get("/carrito")
def ver_carrito():
    
    with Session(engine) as session:
        carrito = session.exec(
            select(Carrito)
        ).first()
        
        if not carrito:
            return {"mensaje": "Carrito no encontrado"}, 404

        resultados = session.exec(
            select(CarritoItem, Producto)
            .where(CarritoItem.carrito_id == carrito.id)
            .join(Producto, Producto.id == CarritoItem.producto_id)
        ).all()

        items = []
        for item, producto in resultados:
            items.append(
                {
                    "id": item.id,
                    "producto_id": item.producto_id,
                    "cantidad": item.cantidad,
                    "producto": producto,
                }
            )
        return {"carrito": carrito, "items": items}
    

# @app.post("/carrito/finalizar")
# @app.post("/carrito/cancelar")

# #Endpoints de Compras
# @app.get("/compras")
# @app.get("/compras/{compra_id}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
