import sqlite3

db_path = 'app/tienda.db'

# URLs de imágenes proporcionadas por el usuario
productos_urls = [
    (1, 'https://acdn-us.mitiendanube.com/stores/001/333/138/products/modelo-rojo-y-negro-0247f35b903dbcfd3716989449729042-480-0.jpg'),  # Camiseta deportiva
    (2, 'https://http2.mlstatic.com/D_NQ_NP_796983-MLA72382095939_102023-O.webp'),  # Guantes deportivos
    (3, 'https://www.stockcenter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw8872d807/products/PU379383-01/PU379383-01-6.JPG'),   # Zapatillas running
    (4, 'https://acdn-us.mitiendanube.com/stores/002/857/914/products/1-abadfd74d9df1bf44a17202826057990-1024-1024.png'),   # Pantalón Cargo
    (5, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUuV5gBIBJ9j-g7FtSxT2-k5eOusrNPxpDA&s'), # Gorra deportiva
    (6, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop'),   # Mochila urbana
    (7, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'), # Reloj deportivo
    (8, 'https://static.owayo-cdn.com/cdn-cgi/image/format=auto,fit=contain,width=490/newhp/img/productHome/productSeitenansicht//Hoodie_Classic_Black_Vorderansicht_2940x3000.png'),   # Sudadera con capucha
    (9, 'https://www.stockcenter.com.ar/dw/image/v2/BDTF_PRD/on/demandware.static/-/Sites-365-dabra-catalog/default/dwd636137e/products/ADJE6436/ADJE6436-1.JPG?sw=600&sh=600'), # Shorts deportivo
    (10, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LUVbe0ePmVS3MI3hSlQiUfs9GjUKBERn-w&s'), # Cinturón deportivo
]

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

for producto_id, imagen_url in productos_urls:
    cursor.execute('UPDATE producto SET imagen = ? WHERE id = ?', (imagen_url, producto_id))

conn.commit()
conn.close()
print("✅ URLs de imágenes actualizadas exitosamente")
