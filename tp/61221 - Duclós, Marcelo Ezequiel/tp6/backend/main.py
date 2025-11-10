from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPAuthorizationCredentials
from sqlmodel import Session, select
from typing import List, Optional

from database import get_session
from models import Producto, ProductoResponse, UsuarioCreate, UsuarioResponse, UsuarioLogin, Usuario
from auth import crear_usuario, convertir_a_usuario_response
from jwt_auth import (
    autenticar_y_crear_token, 
    obtener_usuario_actual, 
    invalidar_token, 
    TokenResponse,
    security
)

app = FastAPI(
    title="TP6 Shop API",
    description="API para tienda de comercio electrónico",
    version="1.0.0"
)

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

@app.get("/")
def root():
    return {
        "mensaje": "TP6 Shop API - Tienda de Comercio Electrónico",
        "version": "1.0.0",
        "endpoints": {
            "productos": "/productos?categoria=&busqueda=&disponible_solo=false",
            "categorias": "/categorias",
            "registro": "/registrar",
            "login": "/iniciar-sesion",
            "logout": "/cerrar-sesion",
            "perfil": "/perfil",
            "usuarios": "/usuarios",
            "documentacion": "/docs"
        },
        "estado": "Filtros de productos implementados",
        "filtros_disponibles": {
            "categoria": "Filtrar por categoría (ej: 'Ropa de hombre')",
            "busqueda": "Buscar en título y descripción",
            "disponible_solo": "Solo productos con stock"
        },
        "autenticacion": "Bearer Token requerido para endpoints protegidos"
    }

@app.get("/productos", response_model=List[ProductoResponse])
def obtener_productos(
    categoria: Optional[str] = None,
    busqueda: Optional[str] = None,
    disponible_solo: bool = False,
    session: Session = Depends(get_session)
):
    """
    Obtener productos con filtros opcionales
    
    - **categoria**: Filtrar por categoría específica
    - **busqueda**: Buscar en título y descripción
    - **disponible_solo**: Solo productos con stock disponible
    """
    statement = select(Producto)
    
    # Aplicar filtros
    if categoria:
        statement = statement.where(Producto.categoria.ilike(f"%{categoria}%"))
    
    if busqueda:
        # Buscar en título y descripción
        busqueda_term = f"%{busqueda}%"
        statement = statement.where(
            (Producto.titulo.ilike(busqueda_term)) | 
            (Producto.descripcion.ilike(busqueda_term))
        )
    
    if disponible_solo:
        statement = statement.where(Producto.existencia > 0)
    
    # Ordenar por ID para consistencia
    statement = statement.order_by(Producto.id)
    
    productos = session.exec(statement).all()
    
    # Convertir a ProductoResponse con la propiedad disponible
    productos_response = []
    for producto in productos:
        producto_dict = producto.model_dump()
        producto_dict["disponible"] = producto.disponible
        productos_response.append(ProductoResponse(**producto_dict))
    
    return productos_response

@app.get("/productos/{producto_id}", response_model=ProductoResponse)
def obtener_producto(producto_id: int, session: Session = Depends(get_session)):
    """Obtener un producto específico por ID"""
    statement = select(Producto).where(Producto.id == producto_id)
    producto = session.exec(statement).first()
    
    if not producto:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Convertir a ProductoResponse
    producto_dict = producto.model_dump()
    producto_dict["disponible"] = producto.disponible
    return ProductoResponse(**producto_dict)

@app.get("/categorias")
def obtener_categorias(session: Session = Depends(get_session)):
    """Obtener todas las categorías de productos disponibles"""
    from sqlmodel import func, distinct
    
    statement = select(distinct(Producto.categoria)).order_by(Producto.categoria)
    categorias = session.exec(statement).all()
    
    return {
        "categorias": categorias,
        "total": len(categorias)
    }

# === ENDPOINTS DE USUARIOS ===

@app.post("/registrar", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def registrar_usuario(usuario_data: UsuarioCreate, session: Session = Depends(get_session)):
    """Registrar un nuevo usuario"""
    try:
        usuario = crear_usuario(session, usuario_data)
        return convertir_a_usuario_response(usuario)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@app.post("/iniciar-sesion")
def iniciar_sesion(credenciales: UsuarioLogin, session: Session = Depends(get_session)):
    """Iniciar sesión y obtener token de autenticación"""
    try:
        token_response = autenticar_y_crear_token(session, credenciales)
        return {
            "access_token": token_response.access_token,
            "token_type": token_response.token_type,
            "expires_in": token_response.expires_in,
            "mensaje": "Sesión iniciada correctamente"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@app.post("/cerrar-sesion")
def cerrar_sesion(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """Cerrar sesión (invalidar token)"""
    token = credentials.credentials
    invalidar_token(token)
    
    return {
        "mensaje": f"Sesión cerrada correctamente para {usuario_actual.nombre}",
        "usuario": usuario_actual.email
    }

@app.get("/perfil", response_model=UsuarioResponse)
def obtener_perfil(usuario_actual: Usuario = Depends(obtener_usuario_actual)):
    """Obtener información del perfil del usuario autenticado"""
    return convertir_a_usuario_response(usuario_actual)

@app.get("/usuarios", response_model=List[UsuarioResponse])
def listar_usuarios(session: Session = Depends(get_session)):
    """Listar todos los usuarios registrados (para testing)"""
    from models import Usuario
    statement = select(Usuario)
    usuarios = session.exec(statement).all()
    return [convertir_a_usuario_response(u) for u in usuarios]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
