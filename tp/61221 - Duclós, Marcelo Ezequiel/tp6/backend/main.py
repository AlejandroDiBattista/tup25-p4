from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from typing import List

from database import get_session
from models import Producto, ProductoResponse, UsuarioCreate, UsuarioResponse
from auth import crear_usuario, convertir_a_usuario_response

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
            "productos": "/productos",
            "registro": "/registrar",
            "usuarios": "/usuarios",
            "documentacion": "/docs"
        },
        "estado": "Registro de usuarios implementado"
    }

@app.get("/productos", response_model=List[ProductoResponse])
def obtener_productos(session: Session = Depends(get_session)):
    """Obtener todos los productos disponibles"""
    statement = select(Producto)
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
