from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import create_db_and_tables
from .routers import auth, productos, carrito, compras

create_db_and_tables()  # FASE 1: crear tablas al iniciar

app = FastAPI(title="API Productos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # FASE 1: restringido al frontend local
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static images (optional if used from backend)
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# Routers
app.include_router(auth.router)
app.include_router(productos.router)
app.include_router(carrito.router)
app.include_router(compras.router)

@app.get("/healthz")
def healthz():
    return "ok"

@app.get("/")
def root():
    return {"mensaje": "API de Productos"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
