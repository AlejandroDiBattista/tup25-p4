from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from pathlib import Path
from typing import List
from datetime import timedelta
import json
import re

# Importar configuración de base de datos y modelos
from database import crear_tablas, get_session, inicializar_datos
from models.productos import Producto, ProductoPublico
from models.usuarios import Usuario, UsuarioRegistro, UsuarioLogin, UsuarioPublico, Token
from models.carrito import (
    Carrito, CarritoItem, CarritoPublico, CarritoItemPublico,
    AgregarItemCarrito, ActualizarItemCarrito, CarritoResumen
)
from auth import (
    get_password_hash, autenticar_usuario, crear_access_token,
    get_usuario_activo_actual, ACCESS_TOKEN_EXPIRE_MINUTES
)
from carrito_helpers import (
    obtener_carrito_usuario, convertir_carrito_a_publico, validar_stock_producto,
    buscar_item_en_carrito, actualizar_fecha_carrito, calcular_total_carrito
)

# Crear la aplicación FastAPI
app = FastAPI(
    title="API E-Commerce",
    description="API para sistema de comercio electrónico con FastAPI y SQLModel",
    version="1.0.0"
)

# Montar directorio de imágenes como archivos estáticos
imagenes_dir = Path(__file__).parent / "imagenes"
app.mount("/imagenes", StaticFiles(directory=str(imagenes_dir)), name="imagenes")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Función para cargar productos desde JSON
def cargar_productos():
    """Cargar productos desde el archivo JSON"""
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

# Evento de inicio - crear tablas y cargar datos
@app.on_event("startup")
def on_startup():
    """Inicializar base de datos al arrancar la aplicación"""
    crear_tablas()
    inicializar_datos()

# ===============================================
# ENDPOINTS BÁSICOS
# ===============================================

@app.get("/")
def root():
    return {"mensaje": "API de E-Commerce - use /productos para obtener el listado"}

@app.get("/health")
def health_check():
    from datetime import datetime
    return {"status": "ok", "timestamp": datetime.now()}

@app.get("/productos", response_model=List[ProductoPublico])
def obtener_productos(session: Session = Depends(get_session)):
    """Obtener lista de productos desde la base de datos"""
    productos = session.exec(select(Producto)).all()
    return productos

@app.get("/productos/{producto_id}", response_model=ProductoPublico)
def obtener_producto(producto_id: int, session: Session = Depends(get_session)):
    """Obtener un producto específico por ID"""
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

@app.get("/categorias")
def obtener_categorias(session: Session = Depends(get_session)):
    """Obtener lista de categorías disponibles"""
    query = select(Producto.categoria).distinct()
    categorias = session.exec(query).all()
    return {"categorias": categorias}

# ===============================================
# ENDPOINTS DE AUTENTICACIÓN
# ===============================================

@app.post("/registrar", response_model=UsuarioPublico)
def registrar_usuario(usuario_data: UsuarioRegistro, session: Session = Depends(get_session)):
    """Registrar un nuevo usuario"""
    
    # Verificar si el email ya existe
    usuario_existente = session.exec(
        select(Usuario).where(Usuario.email == usuario_data.email)
    ).first()
    
    if usuario_existente:
        raise HTTPException(
            status_code=400,
            detail="El email ya está registrado"
        )
    
    # Validar formato de email básico
    if not re.match(r"^[^@]+@[^@]+\.[^@]+$", usuario_data.email):
        raise HTTPException(
            status_code=400,
            detail="Formato de email inválido"
        )
    
    # Crear nuevo usuario
    usuario_dict = usuario_data.model_dump()
    password = usuario_dict.pop("password")
    usuario_dict["password_hash"] = get_password_hash(password)
    
    usuario = Usuario(**usuario_dict)
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    
    return usuario

@app.post("/iniciar-sesion", response_model=Token)
def iniciar_sesion(form_data: UsuarioLogin, session: Session = Depends(get_session)):
    """Iniciar sesión y obtener token de acceso"""
    usuario = autenticar_usuario(form_data.email, form_data.password, session)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = crear_access_token(
        data={"sub": usuario.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/perfil", response_model=UsuarioPublico)
def obtener_perfil(usuario_actual: Usuario = Depends(get_usuario_activo_actual)):
    """Obtener perfil del usuario actual"""
    return usuario_actual

# ===============================================
# ENDPOINTS DEL CARRITO DE COMPRAS
# ===============================================

@app.get("/carrito", response_model=CarritoPublico)
def obtener_carrito(
    usuario_actual: Usuario = Depends(get_usuario_activo_actual),
    session: Session = Depends(get_session)
):
    """Obtener carrito del usuario autenticado"""
    carrito = obtener_carrito_usuario(usuario_actual.id, session)
    return convertir_carrito_a_publico(carrito, session)

@app.post("/carrito/agregar")
def agregar_al_carrito(
    item_data: AgregarItemCarrito,
    usuario_actual: Usuario = Depends(get_usuario_activo_actual),
    session: Session = Depends(get_session)
):
    """Agregar producto al carrito"""
    
    # Validar producto y stock
    producto = validar_stock_producto(item_data.producto_id, item_data.cantidad, session)
    
    # Obtener carrito del usuario
    carrito = obtener_carrito_usuario(usuario_actual.id, session)
    
    # Verificar si el producto ya está en el carrito
    item_existente = buscar_item_en_carrito(carrito.id, item_data.producto_id, session)
    
    if item_existente:
        # Actualizar cantidad si ya existe
        nueva_cantidad = item_existente.cantidad + item_data.cantidad
        
        # Validar stock total
        validar_stock_producto(item_data.producto_id, nueva_cantidad, session)
        
        item_existente.cantidad = nueva_cantidad
        session.add(item_existente)
    else:
        # Crear nuevo item
        nuevo_item = CarritoItem(
            carrito_id=carrito.id,
            producto_id=item_data.producto_id,
            cantidad=item_data.cantidad,
            precio_unitario=producto.precio
        )
        session.add(nuevo_item)
    
    # Actualizar fecha del carrito
    actualizar_fecha_carrito(carrito.id, session)
    session.commit()
    
    return {"mensaje": "Producto agregado al carrito exitosamente"}

@app.put("/carrito/item/{item_id}")
def actualizar_item_carrito(
    item_id: int,
    item_data: ActualizarItemCarrito,
    usuario_actual: Usuario = Depends(get_usuario_activo_actual),
    session: Session = Depends(get_session)
):
    """Actualizar cantidad de un item del carrito"""
    
    # Buscar el item
    item = session.get(CarritoItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    
    # Verificar que el item pertenece al carrito del usuario
    carrito = session.get(Carrito, item.carrito_id)
    if not carrito or carrito.usuario_id != usuario_actual.id:
        raise HTTPException(status_code=403, detail="No autorizado para modificar este item")
    
    # Validar stock
    validar_stock_producto(item.producto_id, item_data.cantidad, session)
    
    # Actualizar cantidad
    item.cantidad = item_data.cantidad
    session.add(item)
    
    # Actualizar fecha del carrito
    actualizar_fecha_carrito(carrito.id, session)
    session.commit()
    
    return {"mensaje": "Item actualizado exitosamente"}

@app.delete("/carrito/item/{item_id}")
def eliminar_item_carrito(
    item_id: int,
    usuario_actual: Usuario = Depends(get_usuario_activo_actual),
    session: Session = Depends(get_session)
):
    """Eliminar un item del carrito"""
    
    # Buscar el item
    item = session.get(CarritoItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    
    # Verificar que el item pertenece al carrito del usuario
    carrito = session.get(Carrito, item.carrito_id)
    if not carrito or carrito.usuario_id != usuario_actual.id:
        raise HTTPException(status_code=403, detail="No autorizado para eliminar este item")
    
    # Eliminar item
    session.delete(item)
    
    # Actualizar fecha del carrito
    actualizar_fecha_carrito(carrito.id, session)
    session.commit()
    
    return {"mensaje": "Item eliminado del carrito exitosamente"}

@app.delete("/carrito/vaciar")
def vaciar_carrito(
    usuario_actual: Usuario = Depends(get_usuario_activo_actual),
    session: Session = Depends(get_session)
):
    """Vaciar completamente el carrito del usuario"""
    
    carrito = obtener_carrito_usuario(usuario_actual.id, session)
    
    # Eliminar todos los items del carrito
    items = session.exec(
        select(CarritoItem).where(CarritoItem.carrito_id == carrito.id)
    ).all()
    
    for item in items:
        session.delete(item)
    
    # Actualizar fecha del carrito
    actualizar_fecha_carrito(carrito.id, session)
    session.commit()
    
    return {"mensaje": "Carrito vaciado exitosamente"}

@app.get("/carrito/resumen", response_model=CarritoResumen)
def resumen_carrito(
    usuario_actual: Usuario = Depends(get_usuario_activo_actual),
    session: Session = Depends(get_session)
):
    """Obtener resumen del carrito (totales)"""
    carrito = obtener_carrito_usuario(usuario_actual.id, session)
    return calcular_total_carrito(carrito.id, session)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8002, reload=True)