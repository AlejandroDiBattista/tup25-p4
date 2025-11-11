"""Script para cargar productos desde productos.json a la base de datos."""
import json
from pathlib import Path
from sqlmodel import Session, create_engine, select
from models.productos import Producto

# Configuración
DATABASE_URL = "sqlite:///./tienda.db"
engine = create_engine(DATABASE_URL, echo=True)

def cargar_productos():
    """Carga productos desde productos.json a la base de datos."""
    # Leer productos.json
    ruta_json = Path(__file__).parent / "productos.json"
    with open(ruta_json, "r", encoding="utf-8") as f:
        productos_json = json.load(f)
    
    with Session(engine) as session:
        # Verificar si ya hay productos
        productos_existentes = session.exec(select(Producto)).all()
        if productos_existentes:
            print(f"⚠️  Ya hay {len(productos_existentes)} productos en la BD.")
            respuesta = input("¿Deseas recargar todos los productos? (s/N): ")
            if respuesta.lower() != 's':
                print("❌ Operación cancelada.")
                return
            # Eliminar productos existentes
            for p in productos_existentes:
                session.delete(p)
            session.commit()
            print("🗑️  Productos existentes eliminados.")
        
        # Cargar nuevos productos
        for prod_data in productos_json:
            producto = Producto(
                id=prod_data.get("id"),
                titulo=prod_data.get("titulo", ""),
                nombre=prod_data.get("titulo", ""),  # Usar titulo como nombre
                descripcion=prod_data.get("descripcion", ""),
                precio=prod_data.get("precio", 0.0),
                categoria=prod_data.get("categoria", ""),
                existencia=prod_data.get("existencia", 0),
                imagen=prod_data.get("imagen", ""),
                valoracion=prod_data.get("valoracion", 0.0)
            )
            session.add(producto)
        
        session.commit()
        
        # Verificar carga
        total = len(session.exec(select(Producto)).all())
        print(f"✅ {total} productos cargados exitosamente.")

if __name__ == "__main__":
    print("🔄 Cargando productos desde productos.json...")
    cargar_productos()
