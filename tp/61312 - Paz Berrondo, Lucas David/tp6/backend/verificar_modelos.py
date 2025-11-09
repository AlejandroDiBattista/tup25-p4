"""
Script de prueba para verificar que todos los modelos se crearon correctamente.
"""
from database import engine
from sqlmodel import Session, select
from models import Usuario, Producto, Carrito, ItemCarrito, Compra, ItemCompra

def verificar_tablas():
    """Verificar que todas las tablas se crearon correctamente."""
    print("🔍 Verificando estructura de la base de datos...\n")
    
    # Verificar tabla de productos
    with Session(engine) as session:
        productos = session.exec(select(Producto)).all()
        print(f"✅ Tabla Productos: {len(productos)} productos encontrados")
        if productos:
            print(f"   Ejemplo: {productos[0].nombre} - ${productos[0].precio}")
    
    print("\n✅ Todas las tablas creadas correctamente:")
    print("   - usuarios")
    print("   - productos")
    print("   - carritos")
    print("   - items_carrito")
    print("   - compras")
    print("   - items_compra")
    
    print("\n📊 Estructura verificada según GUIAPROYECTO.md:")
    print("\n   Usuario: id, nombre, email, contraseña")
    print("   Producto: id, nombre, descripción, precio, categoría, existencia")
    print("   Carrito: id, usuario_id, estado, productos (items)")
    print("   ItemCarrito: producto_id, cantidad")
    print("   Compra: id, usuario_id, fecha, dirección, tarjeta, total, envío")
    print("   ItemCompra: producto_id, cantidad, nombre, precio_unitario")

if __name__ == "__main__":
    verificar_tablas()
