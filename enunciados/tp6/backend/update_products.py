import sqlite3

db_path = 'app/tienda.db'

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Cambiar auriculares a "Guantes deportivos"
cursor.execute('''
UPDATE producto 
SET nombre = 'Guantes deportivos', 
    descripcion = 'Guantes resistentes para entrenamiento y deportes.',
    imagen = 'https://images.unsplash.com/photo-1578306978519-e21cc028cb29?w=500&h=500&fit=crop'
WHERE id = 2
''')

# Cambiar botella de agua a "Cinturón deportivo"
cursor.execute('''
UPDATE producto 
SET nombre = 'Cinturón deportivo', 
    descripcion = 'Cinturón elástico ideal para usar durante entrenamientos.',
    imagen = 'https://images.unsplash.com/photo-1548514173-3cabf45ce1d1?w=500&h=500&fit=crop'
WHERE id = 10
''')

conn.commit()
conn.close()
print("✅ Productos actualizados:")
print("  - Auriculares → Guantes deportivos")
print("  - Botella de agua → Cinturón deportivo")
