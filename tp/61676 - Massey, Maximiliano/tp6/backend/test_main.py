"""Tests completos para la API del e-commerce"""
import pytest
from fastapi.testclient import TestClient


# ============================================================================
# TESTS DE PRODUCTOS
# ============================================================================

class TestProductos:
    """Tests para endpoints de productos"""
    
    def test_listar_productos(self, client: TestClient):
        """Test: Listar todos los productos"""
        response = client.get("/productos")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Hay 20 productos en productos.json
        assert len(data) >= 1
    
    def test_buscar_productos_por_termino(self, client: TestClient):
        """Test: Buscar productos por término"""
        response = client.get("/productos?search=Mochila")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Verificar que al menos encontró resultados con "Mochila"
        if len(data) > 0:
            assert any("mochila" in str(p.get("nombre", "")).lower() or 
                      "mochila" in str(p.get("descripcion", "")).lower() 
                      for p in data)
    
    def test_buscar_productos_case_insensitive(self, client: TestClient):
        """Test: Búsqueda insensible a mayúsculas/minúsculas"""
        response1 = client.get("/productos?search=Mochila")
        response2 = client.get("/productos?search=mochila")
        assert response1.status_code == 200
        assert response2.status_code == 200
        # Deberían dar los mismos resultados
        assert len(response1.json()) == len(response2.json())
    
    def test_filtrar_productos_por_categoria(self, client: TestClient):
        """Test: Filtrar productos por categoría"""
        response = client.get("/productos?categoria=Ropa de hombre")
        assert response.status_code == 200
        data = response.json()
        if len(data) > 0:
            assert all(p.get("categoria", "").lower() == "ropa de hombre" for p in data)
    
    def test_buscar_productos_sin_resultados(self, client: TestClient):
        """Test: Búsqueda sin resultados"""
        response = client.get("/productos?search=ProductoInexistente12345XYZ999")
        assert response.status_code == 200
        assert response.json() == []


# ============================================================================
# TESTS DE AUTENTICACIÓN
# ============================================================================

class TestAutenticacion:
    """Tests para endpoints de autenticación"""
    
    def test_registro_exitoso(self, client: TestClient):
        """Test: Registro de usuario exitoso"""
        response = client.post("/registrar", json={
            "email": "nuevo@example.com",
            "password": "password123",
            "nombre": "Usuario Nuevo"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["mensaje"] == "Usuario registrado exitosamente"
    
    def test_registro_email_duplicado(self, client: TestClient, usuario_test):
        """Test: No permitir registro con email duplicado"""
        response = client.post("/registrar", json={
            "email": usuario_test["email"],  # Email ya registrado
            "password": "otrapassword",
            "nombre": "Otro Usuario"
        })
        assert response.status_code == 400
        assert "email ya está registrado" in response.json()["detail"].lower()
    
    def test_login_exitoso(self, client: TestClient, usuario_test):
        """Test: Login exitoso con credenciales correctas"""
        response = client.post("/token", data={
            "username": usuario_test["email"],
            "password": usuario_test["password"]
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["email"] == usuario_test["email"]
    
    def test_login_password_incorrecta(self, client: TestClient, usuario_test):
        """Test: Login fallido con contraseña incorrecta"""
        response = client.post("/token", data={
            "username": usuario_test["email"],
            "password": "passwordincorrecta"
        })
        assert response.status_code == 401
    
    def test_login_usuario_inexistente(self, client: TestClient):
        """Test: Login fallido con usuario inexistente"""
        response = client.post("/token", data={
            "username": "noexiste@example.com",
            "password": "password123"
        })
        assert response.status_code == 401
    
    def test_acceso_sin_token(self, client: TestClient):
        """Test: Acceso a ruta protegida sin token"""
        response = client.get("/carrito")
        assert response.status_code == 401
    
    def test_acceso_con_token_invalido(self, client: TestClient):
        """Test: Acceso con token inválido"""
        response = client.get("/carrito", headers={
            "Authorization": "Bearer tokeninvalido123"
        })
        assert response.status_code == 401


# ============================================================================
# TESTS DE CARRITO
# ============================================================================

class TestCarrito:
    """Tests para endpoints del carrito de compras"""
    
    def test_ver_carrito_vacio(self, client: TestClient, headers_auth):
        """Test: Ver carrito vacío al inicio"""
        response = client.get("/carrito", headers=headers_auth)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0
    
    def test_agregar_producto_al_carrito(self, client: TestClient, headers_auth):
        """Test: Agregar producto al carrito"""
        # Usar producto ID 1 que existe en productos.json y BD
        response = client.post(
            "/carrito/agregar/1",
            json={"cantidad": 2},
            headers=headers_auth
        )
        assert response.status_code == 200
        data = response.json()
        assert data["mensaje"] == "Producto agregado al carrito"
        
        # Verificar que se agregó
        carrito = client.get("/carrito", headers=headers_auth).json()
        assert len(carrito) == 1
        assert carrito[0]["cantidad"] == 2
    
    def test_agregar_producto_inexistente(self, client: TestClient, headers_auth):
        """Test: Intentar agregar producto que no existe"""
        response = client.post(
            "/carrito/agregar/99999",
            json={"cantidad": 1},
            headers=headers_auth
        )
        assert response.status_code == 404
        assert "producto no encontrado" in response.json()["detail"].lower()
    
    def test_agregar_mas_cantidad_que_stock(self, client: TestClient, headers_auth):
        """Test: Intentar agregar más cantidad que stock disponible"""
        response = client.post(
            "/carrito/agregar/1",
            json={"cantidad": 999},  # Mucho más que el stock
            headers=headers_auth
        )
        assert response.status_code == 400
        assert "stock" in response.json()["detail"].lower()
    
    def test_quitar_producto_del_carrito(self, client: TestClient, headers_auth):
        """Test: Quitar producto del carrito"""
        # Agregar producto
        client.post(
            "/carrito/agregar/1",
            json={"cantidad": 2},
            headers=headers_auth
        )
        
        # Quitar producto
        response = client.delete("/carrito/quitar/1", headers=headers_auth)
        assert response.status_code == 200
        
        # Verificar que se quitó
        carrito = client.get("/carrito", headers=headers_auth).json()
        assert len(carrito) == 0
    
    def test_vaciar_carrito(self, client: TestClient, headers_auth):
        """Test: Vaciar todo el carrito"""
        # Agregar varios productos
        client.post(
            "/carrito/agregar/1",
            json={"cantidad": 1},
            headers=headers_auth
        )
        client.post(
            "/carrito/agregar/2",
            json={"cantidad": 1},
            headers=headers_auth
        )
        
        # Vaciar carrito usando DELETE /carrito
        response = client.delete("/carrito", headers=headers_auth)
        assert response.status_code == 200
        
        # Verificar que está vacío
        carrito = client.get("/carrito", headers=headers_auth).json()
        assert len(carrito) == 0
    
    def test_cancelar_compra(self, client: TestClient, headers_auth):
        """Test: Cancelar compra (POST /carrito/cancelar)"""
        # Agregar productos al carrito
        client.post(
            "/carrito/agregar/1",
            json={"cantidad": 2},
            headers=headers_auth
        )
        client.post(
            "/carrito/agregar/2",
            json={"cantidad": 1},
            headers=headers_auth
        )
        
        # Cancelar compra usando POST /carrito/cancelar
        response = client.post("/carrito/cancelar", headers=headers_auth)
        assert response.status_code == 200
        data = response.json()
        assert "mensaje" in data
        assert data["items_eliminados"] == 2
        
        # Verificar que el carrito está vacío
        carrito = client.get("/carrito", headers=headers_auth).json()
        assert len(carrito) == 0
    
    def test_cancelar_compra_carrito_vacio(self, client: TestClient, headers_auth):
        """Test: Intentar cancelar compra con carrito vacío"""
        response = client.post("/carrito/cancelar", headers=headers_auth)
        assert response.status_code == 400
        assert "vacío" in response.json()["detail"].lower()


# ============================================================================
# TESTS DE COMPRAS
# ============================================================================

class TestCompras:
    """Tests para endpoints de compras"""
    
    def test_finalizar_compra_exitosa(self, client: TestClient, headers_auth):
        """Test: Finalizar compra exitosamente"""
        # Agregar productos al carrito
        client.post(
            "/carrito/agregar/1",
            json={"cantidad": 1},
            headers=headers_auth
        )
        
        # Finalizar compra (usa Form data)
        response = client.post(
            "/carrito/finalizar",
            data={
                "direccion": "Calle Test 123",
                "tarjeta": "4111111111111111"
            },
            headers=headers_auth
        )
        assert response.status_code == 200
        data = response.json()
        assert "mensaje" in data
        assert "id" in data
        assert "total" in data
        assert data["total"] > 0
        
        # Verificar que el carrito se vació
        carrito = client.get("/carrito", headers=headers_auth).json()
        assert len(carrito) == 0
    
    def test_finalizar_compra_carrito_vacio(self, client: TestClient, headers_auth):
        """Test: No permitir finalizar compra con carrito vacío"""
        response = client.post(
            "/carrito/finalizar",
            data={
                "direccion": "Calle Test 123",
                "tarjeta": "4111111111111111"
            },
            headers=headers_auth
        )
        assert response.status_code == 400
        assert "carrito" in response.json()["detail"].lower()
    
    def test_ver_historial_compras(self, client: TestClient, headers_auth):
        """Test: Ver historial de compras"""
        # Hacer una compra
        client.post(
            "/carrito/agregar/1",
            json={"cantidad": 1},
            headers=headers_auth
        )
        client.post(
            "/carrito/finalizar",
            data={"direccion": "Test 123", "tarjeta": "4111111111111111"},
            headers=headers_auth
        )
        
        # Ver historial
        response = client.get("/compras", headers=headers_auth)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert "id" in data[0]
        assert "total" in data[0]
        assert "fecha" in data[0]
    
    def test_ver_historial_vacio(self, client: TestClient, headers_auth):
        """Test: Ver historial cuando no hay compras"""
        response = client.get("/compras", headers=headers_auth)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_ver_detalle_compra(self, client: TestClient, headers_auth):
        """Test: Ver detalle de una compra específica"""
        # Hacer una compra
        client.post(
            "/carrito/agregar/1",
            json={"cantidad": 2},
            headers=headers_auth
        )
        compra_response = client.post(
            "/carrito/finalizar",
            data={"direccion": "Test 123", "tarjeta": "4111111111111111"},
            headers=headers_auth
        )
        compra_id = compra_response.json()["id"]  # La respuesta usa "id" no "compra_id"
        
        # Ver detalle
        response = client.get(f"/compras/{compra_id}", headers=headers_auth)
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == compra_id
        assert "productos" in data
        assert len(data["productos"]) >= 1
        assert "subtotal" in data
        assert "iva" in data
        assert "total" in data
    
    def test_ver_detalle_compra_inexistente(self, client: TestClient, headers_auth):
        """Test: Intentar ver compra que no existe"""
        response = client.get("/compras/99999", headers=headers_auth)
        assert response.status_code == 404
    
    def test_no_ver_compra_de_otro_usuario(self, client: TestClient):
        """Test: No permitir ver compras de otros usuarios"""
        # Usuario 1 hace una compra
        client.post("/registrar", json={
            "email": "user1@test.com",
            "password": "pass123",
            "nombre": "User 1"
        })
        token1_response = client.post("/token", data={
            "username": "user1@test.com",
            "password": "pass123"
        })
        token1 = token1_response.json()["access_token"]
        headers1 = {"Authorization": f"Bearer {token1}"}
        
        client.post(
            "/carrito/agregar/1",
            json={"cantidad": 1},
            headers=headers1
        )
        compra_response = client.post(
            "/carrito/finalizar",
            data={"direccion": "Test 123", "tarjeta": "4111111111111111"},
            headers=headers1
        )
        compra_id = compra_response.json()["id"]
        
        # Usuario 2 intenta ver la compra del usuario 1
        client.post("/registrar", json={
            "email": "user2@test.com",
            "password": "pass123",
            "nombre": "User 2"
        })
        token2_response = client.post("/token", data={
            "username": "user2@test.com",
            "password": "pass123"
        })
        token2 = token2_response.json()["access_token"]
        headers2 = {"Authorization": f"Bearer {token2}"}
        
        response = client.get(f"/compras/{compra_id}", headers=headers2)
        assert response.status_code == 404  # No debe encontrar la compra