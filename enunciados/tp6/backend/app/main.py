from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routers import auth, productos, carrito, compras

app = FastAPI(title="API Tienda")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas si no existen
init_db()

# Cargar datos iniciales (comentado temporalmente para debugging)
# try:
#     from initial_data import cargar_productos_iniciales
#     cargar_productos_iniciales()
# except Exception as e:
#     print(f"Advertencia: No se pudieron cargar datos iniciales: {e}")
#     import traceback
#     traceback.print_exc()

# Incluir routers
app.include_router(auth.router)
app.include_router(productos.router)
app.include_router(carrito.router)
app.include_router(compras.router)

@app.get("/")
def home():
    return {"mensaje": "Bienvenido a la API de Tienda"}