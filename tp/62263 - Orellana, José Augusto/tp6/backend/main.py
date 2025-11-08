# from enunciados.tp6.backend import models
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from pathlib import Path

from contextlib import asynccontextmanager
from database import create_db_and_tables, engine, get_session

from sqlmodel import Session, select
from models.productos import Producto

# Se trae los "contratos" que se definieron
from models.schemas import UsuarioRegistro, UsuarioRespuesta

# Se trae el modelo de la base de datos de Usuario
from models.usuarios import Usuario

# Se trae la función para hashear contraseñas
from security import obtener_hash_contrasenia

# Función lifespan para inicializar la base de datos al iniciar la aplicación
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("iniciando la aplicación...")
    print("Creando la base de datos y las tablas si no existen...")

    create_db_and_tables()

    print("Base de datos y tablas listas.")

    # Lógia para inicializar datos en la base de datos
    print("Verificando carga inicial de productos...")

    # Se abre una sesión con la base de datos
    with Session(engine) as session:
        # 1. Se verifica si hay productos en la base de datos
        # Se crea una consulta para seleccionar el primer producto
        statement = select(Producto).limit(1)

        # Se ejecuta la consulta
        primer_producto = session.exec(statement).first()

        # 2. Si no hay productos, se cargan desde el archivo JSON
        if primer_producto is None:
            print("La tabla 'producto' está vacía. Cargando datos desde productos.")

            # Ruta al JSON de productos
            ruta_productos = Path(__file__).parent / "productos.json"

            with open(ruta_productos, "r", encoding="utf-8") as archivo:
                datos_json = json.load(archivo)

                # 3. Iterar y crear modelos
                for item_json in datos_json:
                    # Se crea un objeto Producto de SQLModel
                    producto_a_crear = Producto(**item_json)

                    # 4. Se agrega a la sesión
                    session.add(producto_a_crear)

            # 5. Se guardan TODOS los productos en la base de datos
            session.commit()
            print(f"¡Éxito! Se cargaron {len(datos_json)} productos en la base de datos.")
        else:
            print("La tabla 'producto' ya tiene datos. No se realiza la carga inicial.")

    print("Servidor listo.")
    yield
    # Esto se ejecuta al apagar la aplicación
    print("Apagando la aplicación...")

# Se agrega el lifespan a la aplicación FastAPI
app = FastAPI(
    title="API de E-Commerce - TP6",
    lifespan=lifespan
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
    return {"mensaje": "API de Productos - use /productos para obtener el listado"}

@app.get("/productos")
def obtener_productos(session: Session = Depends(get_session)):
    # Se crea la consulta para seleccionar todos los productos
    statement = select(Producto)

    # 2. Se ejecuta la consulta usando la sesión inyectada
    productos = session.exec(statement).all()

    # 3. Se retorna la lista de productos
    return 

@app.post("/registrar", response_model=UsuarioRespuesta)
def registrar_usuario(usuario_data: UsuarioRegistro, session: Session = Depends(get_session)):
    # 1. Verificar si el usuario ya existe
    statement = select(Usuario).where(Usuario.email == usuario_data.email)
    usuario_existente = session.exec(statement).first()

    if usuario_existente:
        raise HTTPException(
            status_code=400,
            detail="El email ya está registrado."
        )

    # 2. Hashear la contraseña
    hash_contrasenia = obtener_hash_contrasenia(usuario_data.contrasenia)

    # 3. Crear el nuevo usuario en la base de datos
    nuevo_usuario = Usuario(
        nombre=usuario_data.nombre,
        email=usuario_data.email,
        contrasenia=hash_contrasenia
    )

    # 4. Guardar en la base de datos
    session.add(nuevo_usuario)
    session.commit()
    # Se refresca para obtener el ID generado
    session.refresh(nuevo_usuario)

    # 5. Devolver la respuesta
    return nuevo_usuario

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
