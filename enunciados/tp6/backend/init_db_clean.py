import sqlite3
import os

db_path = 'app/tienda.db'

# Eliminar BD si existe
if os.path.exists(db_path):
    try:
        os.remove(db_path)
        print("✅ BD eliminada")
    except Exception as e:
        print(f"No se pudo eliminar BD (posiblemente está en uso): {e}")
        print("Continuando de todas formas...")

# Crear conexión
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Crear tabla user con la estructura correcta
cursor.execute('''
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
''')
print("✅ Tabla user creada")

# Crear tabla producto
cursor.execute('''
CREATE TABLE producto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL,
    precio REAL NOT NULL,
    stock INTEGER NOT NULL,
    imagen TEXT,
    tipo_iva TEXT DEFAULT 'general',
    descripcion TEXT
)
''')
print("✅ Tabla producto creada")

# Crear tabla carritoitem
cursor.execute('''
CREATE TABLE carritoitem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (producto_id) REFERENCES producto(id)
)
''')
print("✅ Tabla carritoitem creada")

# Crear tabla compra
cursor.execute('''
CREATE TABLE compra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    direccion TEXT NOT NULL,
    detalles_pago TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
)
''')
print("✅ Tabla compra creada")

conn.commit()
conn.close()
print("\n✅ Base de datos recreada exitosamente con schema correcto")
