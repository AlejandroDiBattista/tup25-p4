from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from pathlib import Path


from sqlmodel import Session, select
from database import crear_tablas, get_session, engine
from models.usuarios import Usuario
from models.productos import Producto
from models.carrito import Carrito, ItemCarrito
from models.compras import Compra, ItemCompra


app = FastAPI(title="API Productos")



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
def obtener_productos():
    # 1. Creamos la sentencia de consulta: SELECT * FROM producto
    statement = select(Producto)
    
    # 2. Ejecutamos la consulta usando la sesión
    productos_db = session.exec(statement).all()
    
    # 3. Retornamos la lista de objetos Producto
    return productos_db



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
