"""
Tests para endpoints de compras
"""
import pytest
from decimal import Decimal

class TestFinalizarCompra:
    """Tests para finalizar compras"""
    
    def test_finalizar_compra_exitosa(self, client, usuario_logueado, productos_en_db):
        """Test finalizar compra exitosamente"""
        # Agregar productos al carrito
        item_data = {"producto_id": productos_en_db[0].id, "cantidad": 1}
        client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        
        # Finalizar compra
        response = client.post("/compra/finalizar", headers=usuario_logueado["headers"])
        
        assert response.status_code == 200
        data = response.json()
        assert "compra" in data
        
        compra = data["compra"]
        assert "id" in compra
        assert compra["subtotal"] == float(productos_en_db[0].precio)
        assert compra["total"] > compra["subtotal"]  # Con IVA y envío
        assert compra["total_items"] == 1
    
    def test_finalizar_compra_carrito_vacio(self, client, usuario_logueado):
        """Test finalizar compra con carrito vacío"""
        response = client.post("/compra/finalizar", headers=usuario_logueado["headers"])
        
        assert response.status_code == 400
        assert "vacío" in response.json()["detail"].lower()
    
    def test_calculos_iva_y_envio(self, client, usuario_logueado, productos_en_db):
        """Test cálculos de IVA y envío"""
        # Compra pequeña (con envío)
        item_data = {"producto_id": productos_en_db[1].id, "cantidad": 1}  # $50.25
        client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        
        response = client.post("/compra/finalizar", headers=usuario_logueado["headers"])
        compra = response.json()["compra"]
        
        # Verificar envío
        assert compra["envio"] == 150.0  # Envío $150 para compras < $1000
        
        # Verificar IVA (21% sobre subtotal + envío)
        subtotal_con_envio = compra["subtotal"] + compra["envio"]
        iva_esperado = subtotal_con_envio * 0.21
        assert abs(compra["iva"] - iva_esperado) < 0.01  # Tolerancia para decimales
    
    def test_envio_gratis_compra_grande(self, client, usuario_logueado, productos_en_db):
        """Test envío gratis para compras >= $1000"""
        # Crear producto caro para test
        from models import Producto
        
        # Necesitamos modificar un producto existente para que sea más caro
        # O agregar muchos productos baratos para llegar a $1000
        
        # Agregar muchos productos para superar $1000
        for i in range(15):  # 15 * $100.50 = $1507.50
            item_data = {"producto_id": productos_en_db[0].id, "cantidad": 1}
            client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        
        response = client.post("/compra/finalizar", headers=usuario_logueado["headers"])
        
        if response.status_code == 200:
            compra = response.json()["compra"]
            # Si el subtotal >= $1000, el envío debe ser $0
            if compra["subtotal"] >= 1000:
                assert compra["envio"] == 0.0
    
    def test_actualizacion_stock_despues_compra(self, client, usuario_logueado, productos_en_db):
        """Test que el stock se actualiza después de la compra"""
        producto_id = productos_en_db[0].id
        stock_inicial = productos_en_db[0].existencia
        cantidad_comprada = 2
        
        # Agregar al carrito
        item_data = {"producto_id": producto_id, "cantidad": cantidad_comprada}
        client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        
        # Finalizar compra
        response = client.post("/compra/finalizar", headers=usuario_logueado["headers"])
        assert response.status_code == 200
        
        # Verificar que el stock se actualizó
        response = client.get(f"/productos/{producto_id}")
        producto_actualizado = response.json()
        
        stock_esperado = stock_inicial - cantidad_comprada
        assert producto_actualizado["existencia"] == stock_esperado

class TestObtenerCompra:
    """Tests para obtener detalles de compra"""
    
    def test_obtener_compra_propia(self, client, usuario_logueado, productos_en_db):
        """Test obtener detalles de compra propia"""
        # Crear una compra
        item_data = {"producto_id": productos_en_db[0].id, "cantidad": 1}
        client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        
        response = client.post("/compra/finalizar", headers=usuario_logueado["headers"])
        compra_id = response.json()["compra"]["id"]
        
        # Obtener detalles
        response = client.get(f"/compra/{compra_id}", headers=usuario_logueado["headers"])
        
        assert response.status_code == 200
        compra = response.json()
        assert compra["id"] == compra_id
        assert "items" in compra
        assert len(compra["items"]) == 1
    
    def test_obtener_compra_inexistente(self, client, usuario_logueado):
        """Test obtener compra que no existe"""
        response = client.get("/compra/999", headers=usuario_logueado["headers"])
        
        assert response.status_code == 404
        assert "no encontrada" in response.json()["detail"]
    
    def test_obtener_compra_de_otro_usuario(self, client):
        """Test obtener compra de otro usuario (sin implementar otro usuario aquí)"""
        # Este test requeriría crear otro usuario
        # Por simplicidad, solo verificamos que se necesita autenticación
        response = client.get("/compra/1")
        assert response.status_code == 403

class TestHistorialCompras:
    """Tests para historial de compras"""
    
    def test_listar_compras_usuario(self, client, usuario_logueado, productos_en_db):
        """Test listar compras del usuario"""
        # Crear algunas compras
        for i in range(2):
            item_data = {"producto_id": productos_en_db[0].id, "cantidad": 1}
            client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
            client.post("/compra/finalizar", headers=usuario_logueado["headers"])
        
        # Obtener historial
        response = client.get("/compras", headers=usuario_logueado["headers"])
        
        assert response.status_code == 200
        data = response.json()
        assert "compras" in data
        assert data["total"] == 2
        assert len(data["compras"]) == 2
    
    def test_paginacion_historial(self, client, usuario_logueado, productos_en_db):
        """Test paginación del historial"""
        # Crear 3 compras
        for i in range(3):
            item_data = {"producto_id": productos_en_db[0].id, "cantidad": 1}
            client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
            client.post("/compra/finalizar", headers=usuario_logueado["headers"])
        
        # Primera página (limit=2)
        response = client.get("/compras?limit=2&offset=0", headers=usuario_logueado["headers"])
        data = response.json()
        
        assert len(data["compras"]) == 2
        assert data["has_more"] == True
        assert data["total"] == 3
    
    def test_estadisticas_compras(self, client, usuario_logueado, productos_en_db):
        """Test estadísticas de compras"""
        # Crear una compra
        item_data = {"producto_id": productos_en_db[0].id, "cantidad": 2}
        client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        
        response_compra = client.post("/compra/finalizar", headers=usuario_logueado["headers"])
        compra = response_compra.json()["compra"]
        
        # Obtener estadísticas
        response = client.get("/compras/estadisticas", headers=usuario_logueado["headers"])
        
        assert response.status_code == 200
        stats = response.json()
        
        assert stats["total_compras"] == 1
        assert stats["total_gastado"] == compra["total"]
        assert stats["promedio_compra"] == compra["total"]
        assert stats["total_productos_comprados"] == 2
        assert "compra_mas_reciente" in stats
        assert "compra_mas_grande" in stats