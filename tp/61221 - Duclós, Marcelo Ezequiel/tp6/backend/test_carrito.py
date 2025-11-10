"""
Tests para endpoints de carrito
"""
import pytest

class TestCarrito:
    """Tests para funcionalidades del carrito"""
    
    def test_obtener_carrito_vacio(self, client, usuario_logueado):
        """Test obtener carrito vacío inicial"""
        response = client.get("/carrito", headers=usuario_logueado["headers"])
        
        assert response.status_code == 200
        carrito = response.json()
        assert carrito["total_items"] == 0
        assert carrito["subtotal"] == 0.0
        assert carrito["items"] == []
    
    def test_agregar_producto_al_carrito(self, client, usuario_logueado, productos_en_db):
        """Test agregar producto al carrito"""
        producto_id = productos_en_db[0].id
        item_data = {"producto_id": producto_id, "cantidad": 2}
        
        response = client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        
        assert response.status_code == 201
        data = response.json()
        assert "mensaje" in data
        assert data["cantidad"] == 2
        assert data["subtotal"] == float(productos_en_db[0].precio * 2)
    
    def test_agregar_producto_inexistente(self, client, usuario_logueado):
        """Test agregar producto que no existe"""
        item_data = {"producto_id": 999, "cantidad": 1}
        
        response = client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        assert response.status_code == 404
    
    def test_agregar_cantidad_invalida(self, client, usuario_logueado, productos_en_db):
        """Test agregar cantidad inválida"""
        producto_id = productos_en_db[0].id
        
        # Cantidad negativa
        item_data = {"producto_id": producto_id, "cantidad": -1}
        response = client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        assert response.status_code == 422
        
        # Cantidad cero
        item_data = {"producto_id": producto_id, "cantidad": 0}
        response = client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        assert response.status_code == 422
    
    def test_agregar_excede_stock(self, client, usuario_logueado, productos_en_db):
        """Test agregar producto excediendo stock o límites de negocio"""
        producto_id = productos_en_db[0].id
        stock_disponible = productos_en_db[0].existencia
        
        # Intentar agregar más del stock disponible, pero respetando límites de producto
        cantidad_a_probar = min(stock_disponible + 1, 10)
        
        if cantidad_a_probar > stock_disponible:
            # Si podemos probar exceso de stock
            item_data = {"producto_id": producto_id, "cantidad": cantidad_a_probar}
            response = client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
            assert response.status_code == 400
            assert "stock insuficiente" in response.json()["detail"].lower()
        else:
            # Si el stock es >= 10, probar límite de cantidad por producto
            item_data = {"producto_id": producto_id, "cantidad": 11}  # Excede límite de 10
            response = client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
            assert response.status_code == 400
            assert ("más de 10 unidades" in response.json()["detail"] or 
                   "stock insuficiente" in response.json()["detail"].lower())
    
    def test_actualizar_cantidad_item(self, client, usuario_logueado, productos_en_db):
        """Test actualizar cantidad de item en carrito"""
        producto_id = productos_en_db[0].id
        
        # Primero agregar al carrito
        item_data = {"producto_id": producto_id, "cantidad": 2}
        response = client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        assert response.status_code == 201
        
        # Actualizar cantidad
        update_data = {"cantidad": 3}
        response = client.put(f"/carrito/{producto_id}", json=update_data, headers=usuario_logueado["headers"])
        
        assert response.status_code == 200
        data = response.json()
        assert data["nueva_cantidad"] == 3
        assert data["subtotal"] == productos_en_db[0].precio * 3
    
    def test_eliminar_item_del_carrito(self, client, usuario_logueado, productos_en_db):
        """Test eliminar item del carrito"""
        producto_id = productos_en_db[0].id
        
        # Primero agregar al carrito
        item_data = {"producto_id": producto_id, "cantidad": 2}
        client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        
        # Eliminar item
        response = client.delete(f"/carrito/{producto_id}", headers=usuario_logueado["headers"])
        
        assert response.status_code == 200
        assert "eliminado del carrito exitosamente" in response.json()["mensaje"]
        
        # Verificar que el carrito esté vacío
        response = client.get("/carrito", headers=usuario_logueado["headers"])
        carrito = response.json()
        assert carrito["total_items"] == 0
    
    def test_cancelar_compra(self, client, usuario_logueado, productos_en_db):
        """Test cancelar compra (vaciar carrito)"""
        # Agregar productos al carrito
        for producto in productos_en_db:
            item_data = {"producto_id": producto.id, "cantidad": 1}
            client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        
        # Cancelar compra
        response = client.post("/carrito/cancelar", headers=usuario_logueado["headers"])
        
        assert response.status_code == 200
        assert "vaciado exitosamente" in response.json()["mensaje"]
        
        # Verificar carrito vacío
        response = client.get("/carrito", headers=usuario_logueado["headers"])
        carrito = response.json()
        assert carrito["total_items"] == 0

class TestCarritoCalculos:
    """Tests para cálculos del carrito"""
    
    def test_calculos_carrito_multiple_productos(self, client, usuario_logueado, productos_en_db):
        """Test cálculos con múltiples productos"""
        # Agregar primer producto
        item_data = {"producto_id": productos_en_db[0].id, "cantidad": 2}
        client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        
        # Agregar segundo producto
        item_data = {"producto_id": productos_en_db[1].id, "cantidad": 1}
        client.post("/carrito", json=item_data, headers=usuario_logueado["headers"])
        
        # Verificar carrito
        response = client.get("/carrito", headers=usuario_logueado["headers"])
        carrito = response.json()
        
        assert carrito["total_items"] == 3  # 2 + 1
        
        subtotal_esperado = (productos_en_db[0].precio * 2) + (productos_en_db[1].precio * 1)
        assert carrito["subtotal"] == subtotal_esperado
        
        assert len(carrito["items"]) == 2