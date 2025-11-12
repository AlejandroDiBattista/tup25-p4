from fastapi import FastAPI
from routers import users
from routers import products
from routers import cart
from routers import purchases
from db import init_db
from fastapi.middleware.cors import CORSMiddleware

print("✅ Iniciando app FastAPI...")


app = FastAPI(title="API E-commerce", version="1.0")

# Habilitar CORS para frontend en localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("📦 Incluyendo routers...")
app.include_router(users.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(purchases.router)
print("✅ Routers incluidos correctamente")


@app.on_event("startup")
def on_startup():
    # Initialize DB and optionally load producto.json
    init_db(load_products=True)


@app.get("/")
def root():
    return {"message": "Bienvenido a la API del E-commerce"}
