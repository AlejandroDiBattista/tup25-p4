import json
import os
from sqlmodel import Session, select
from app.models import Producto
from app.database import engine, init_db

def cargar_productos_iniciales():
    """Carga los productos del archivo JSON a la base de datos"""
    init_db()
    
    # Ruta al archivo JSON
    json_path = os.path.join(os.path.dirname(__file__), 'app', 'data', 'productos.json')
    
    with open(json_path, 'r', encoding='utf-8') as f:
        productos_data = json.load(f)
    
    with Session(engine) as session:
        # Verificar si ya existen productos
        existing = session.exec(select(Producto)).all()
        if existing:
            print(f"Ya hay {len(existing)} productos en la BD. Saltando carga inicial.")
            return
        
        # Agregar cada producto
        for prod_data in productos_data:
            producto = Producto(
                nombre=prod_data.get('nombre'),
                categoria=prod_data.get('categoria'),
                precio=prod_data.get('precio'),
                stock=prod_data.get('stock'),
                descripcion=prod_data.get('descripcion'),
                imagen=prod_data.get('imagen'),
                tipo_iva='general'  # Por defecto
            )
            session.add(producto)
        
        session.commit()
        print(f"✅ {len(productos_data)} productos cargados exitosamente")

if __name__ == '__main__':
    cargar_productos_iniciales()
