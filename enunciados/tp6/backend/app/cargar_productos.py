import os
import sys
import json
from sqlalchemy.orm import Session

# --- Ajuste del path para evitar errores de importación ---
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base
from app import models

# --- Crear las tablas si no existen ---
Base.metadata.create_all(bind=engine)

# --- Ruta al archivo JSON ---
RUTA_JSON = os.path.join(os.path.dirname(__file__), "data", "productos.json")

def cargar_productos():
    """Carga productos desde un archivo JSON a la base de datos."""
    if not os.path.exists(RUTA_JSON):
        print(f"❌ No se encontró el archivo: {RUTA_JSON}")
        return

    # Abrir archivo JSON
    with open(RUTA_JSON, "r", encoding="utf-8") as f:
        productos = json.load(f)

    # Crear sesión de base de datos
    session = Session(bind=engine)

    try:
        for p in productos:
            # Evitar duplicados
            existe = session.query(models.Producto).filter_by(nombre=p["nombre"]).first()
            if not existe:
                nuevo = models.Producto(
                    nombre=p["nombre"],
                    categoria=p["categoria"],
                    precio=p["precio"],
                    stock=p["stock"],
                    imagen=p.get("imagen", ""),
                    tipo_iva=p.get("tipo_iva", "21%"),
                    descripcion=p.get("descripcion", "")
                )
                session.add(nuevo)
                print(f"✅ Producto agregado: {p['nombre']}")
            else:
                print(f"⚠️ Producto ya existente: {p['nombre']}")

        session.commit()
        print("\n🎉 Carga de productos completada correctamente.")
    except Exception as e:
        session.rollback()
        print(f"❌ Error al cargar productos: {e}")
    finally:
        session.close()

# --- Ejecutar directamente desde consola ---
if __name__ == "__main__":
    cargar_productos()