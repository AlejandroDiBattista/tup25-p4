"""
Tests para endpoints de autenticación
"""
import pytest

class TestRegistroUsuario:
    """Tests para registro de usuarios"""
    
    def test_registro_exitoso(self, client, usuario_test_data):
        """Test registro exitoso de usuario"""
        response = client.post("/registrar", json=usuario_test_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["nombre"] == usuario_test_data["nombre"]
        assert data["email"] == usuario_test_data["email"]
        assert "id" in data
        assert "fecha_registro" in data
        assert "contraseña" not in data  # No debe devolver contraseña
    
    def test_registro_email_duplicado(self, client, usuario_registrado):
        """Test registro con email duplicado"""
        # Intentar registrar el mismo email
        response = client.post("/registrar", json={
            "nombre": "Otro Usuario",
            "email": usuario_registrado["email"],
            "contraseña": "otra_pass123"
        })
        
        assert response.status_code == 400
        assert "Ya existe un usuario con este email" in response.json()["detail"]
    
    def test_registro_datos_invalidos(self, client):
        """Test registro con datos inválidos"""
        # Email inválido
        response = client.post("/registrar", json={
            "nombre": "Test",
            "email": "email_invalido",
            "contraseña": "pass123"
        })
        assert response.status_code == 400
        
        # Contraseña muy corta
        response = client.post("/registrar", json={
            "nombre": "Test",
            "email": "test@example.com",
            "contraseña": "123"
        })
        assert response.status_code == 422

class TestIniciarSesion:
    """Tests para inicio de sesión"""
    
    def test_login_exitoso(self, client, usuario_registrado):
        """Test login exitoso"""
        login_data = {
            "email": usuario_registrado["email"],
            "contraseña": usuario_registrado["contraseña"]
        }
        response = client.post("/iniciar-sesion", json=login_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0
    
    def test_login_email_inexistente(self, client):
        """Test login con email inexistente"""
        response = client.post("/iniciar-sesion", json={
            "email": "noexiste@example.com",
            "contraseña": "password123"
        })
        
        assert response.status_code == 401
        assert "incorrectos" in response.json()["detail"].lower()
    
    def test_login_contraseña_incorrecta(self, client, usuario_registrado):
        """Test login con contraseña incorrecta"""
        response = client.post("/iniciar-sesion", json={
            "email": usuario_registrado["email"],
            "contraseña": "contraseña_incorrecta"
        })
        
        assert response.status_code == 401
        assert "incorrectos" in response.json()["detail"].lower()

class TestCerrarSesion:
    """Tests para cerrar sesión"""
    
    def test_logout_exitoso(self, client, usuario_logueado):
        """Test logout exitoso"""
        response = client.post("/cerrar-sesion", headers=usuario_logueado["headers"])
        
        assert response.status_code == 200
        assert "Sesión cerrada correctamente" in response.json()["mensaje"]
    
    def test_logout_sin_token(self, client):
        """Test logout sin token"""
        response = client.post("/cerrar-sesion")
        
        assert response.status_code == 403

class TestAutorizacion:
    """Tests para verificar autorización"""
    
    def test_endpoint_protegido_sin_token(self, client):
        """Test acceso a endpoint protegido sin token"""
        response = client.get("/carrito")
        assert response.status_code == 403
    
    def test_endpoint_protegido_con_token_invalido(self, client):
        """Test acceso con token inválido"""
        headers = {"Authorization": "Bearer token_invalido"}
        response = client.get("/carrito", headers=headers)
        assert response.status_code == 401
    
    def test_endpoint_protegido_con_token_valido(self, client, usuario_logueado):
        """Test acceso con token válido"""
        response = client.get("/carrito", headers=usuario_logueado["headers"])
        # Debe funcionar (aunque carrito esté vacío)
        assert response.status_code == 200