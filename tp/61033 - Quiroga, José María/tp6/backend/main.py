from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, products, cart, purchases
from app.database import create_db_and_tables


# CORS (permitir acceso desde el frontend Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Rutas
app.include_router(users.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(purchases.router)

@app.get("/")
def root():
    return {"message": "API del E-commerce funcionando 🚀"}
