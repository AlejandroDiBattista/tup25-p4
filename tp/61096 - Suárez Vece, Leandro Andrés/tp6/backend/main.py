from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from pathlib import Path
from unidecode import unidecode


from sqlmodel import Session, select
from database import crear_tablas, get_session, engine
from models.usuarios import Usuario
from models.productos import Producto
from models.carrito import Carrito, ItemCarrito
from models.compras import Compra, ItemCompra


app = FastAPI(title="API Productos")


def normalize_text(text: str) -> str:
    """Convierte el texto a minúsculas y elimina los acentos para almacenamiento."""
    if not text:
        return ""
    #Quitar acentos
    text = unidecode(text)
    #Convertir a minúsculas
    return text.lower()


def cargar_datos_iniciales(session: Session):
    """Inserta los productos del JSON en la DB si la tabla está vacía."""
    
    # comprobamos si ya hay productos en la base de datos
    productos_existentes = session.exec(select(Producto)).all()

    if not productos_existentes:
        print("La base de datos de productos está vacía. Cargando desde JSON...")
        
        datos_json = cargar_productos() # La función que ya tenías
        
        
        productos_a_crear = []
        for item in datos_json:
            # Crea una instancia de Producto para cada ítem del JSON

            if 'titulo' in item:
                item['nombre'] = item.pop('titulo')

            if 'categoria' in item:
                item['categoria'] = normalize_text(item['categoria'])

            producto_db = Producto.model_validate(item) 
            productos_a_crear.append(producto_db)
            
        session.add_all(productos_a_crear)
        session.commit()
        print(f"Cargados {len(productos_a_crear)} productos en la base de datos.")
    else:
        print("La base de datos ya contiene productos.")

# crear la base de datos sqlite
@app.on_event("startup")
def startup():
    crear_tablas()
    try:
        with Session(engine) as session: # Abre una sesión para la carga inicial
            cargar_datos_iniciales(session)
    except Exception as e:
        # Esto te ayudará a diagnosticar si el error persiste
        print(f"Error durante la carga inicial de datos: {e}")


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

@app.get("/productos")
def obtener_productos(
    session: Session = Depends(get_session),
    categoria: str = Query(None, description="Filtrar productos por categoría"),
    buscar: str = Query(None, description="Término de búsqueda por nombre o descripción"),
):
    statement = select(Producto)

    if categoria:
        categoria_normalizada = normalize_text(categoria)
        termino_categoria = f"%{categoria_normalizada}%"

        statement = statement.where(
            Producto.categoria.ilike(termino_categoria) 
        )

    if buscar:
        termino_busqueda = f"%{buscar}%"

        statement = statement.where(
            (Producto.nombre.ilike(termino_busqueda)) |  # Filtra por nombre
            (Producto.descripcion.ilike(termino_busqueda)) # O Filtra por descripción
        )

    productos_db = session.exec(statement).all()
    
    return productos_db

@app.get("/productos/{producto_id}", response_model=Producto)
def obtener_producto_por_id(
    producto_id: int, # FastAPI automáticamente toma este valor de la URL
    session: Session = Depends(get_session)
):   
    producto = session.get(Producto, producto_id)
    
    if not producto:
        # Si no se encuentra, devolvemos el código de estado 404 Not Found
        raise HTTPException(
            status_code=404,
            detail=f"Producto con ID {producto_id} no encontrado"
        )
        
    return producto

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
