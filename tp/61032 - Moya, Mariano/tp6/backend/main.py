
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from models.db_models import Usuario
from init_db import engine
import json
from pathlib import Path
import hashlib

app = FastAPI(title="API Productos")

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

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Endpoint: Iniciar sesión (autenticación simple)
from fastapi import Form

@app.post("/iniciar-sesion")
def iniciar_sesion(email: str = Form(...), password: str = Form(...)):
    with Session(engine) as session:
        usuario = session.exec(select(Usuario).where(Usuario.email == email)).first()
        if not usuario or hash_password(password) != usuario.password:
            raise HTTPException(status_code=401, detail="Credenciales inválidas.")
        return {"mensaje": "Inicio de sesión exitoso", "usuario_id": usuario.id, "nombre": usuario.nombre, "email": usuario.email}

@app.post("/registrar")
def registrar_usuario(nombre: str, email: str, password: str):
    with Session(engine) as session:
        existe = session.exec(select(Usuario).where(Usuario.email == email)).first()
        if existe:
            raise HTTPException(status_code=400, detail="El email ya está registrado.")
        usuario = Usuario(nombre=nombre, email=email, password=hash_password(password))
        session.add(usuario)
        session.commit()
        session.refresh(usuario)
        return {"mensaje": "Usuario registrado correctamente."}

@app.get("/")
def root():
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}

def cargar_productos():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

@app.get("/productos")
def obtener_productos():
    productos = cargar_productos()
    return productos

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
