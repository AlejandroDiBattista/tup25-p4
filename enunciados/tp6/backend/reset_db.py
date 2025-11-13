import sqlite3
import os

db_path = 'app/tienda.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # Obtener todas las tablas
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print('Tablas encontradas:', tables)
    # Eliminar todas las tablas
    for table in tables:
        cursor.execute(f'DROP TABLE IF EXISTS {table[0]}')
    conn.commit()
    conn.close()
    print('✅ Todas las tablas fueron eliminadas')
else:
    print('BD no existe')
