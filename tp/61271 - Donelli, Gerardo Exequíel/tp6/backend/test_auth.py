"""
Script de prueba para verificar los endpoints de autenticación.
"""
import httpx
import json

BASE_URL = "http://localhost:8000"

def test_registro():
    """Prueba el endpoint de registro."""
    print("🧪 Probando registro de usuario...")
    
    data = {
        "nombre": "Usuario de Prueba",
        "email": "prueba@example.com",
        "contraseña": "password123"
    }
    
    response = httpx.post(f"{BASE_URL}/registrar", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response text: {response.text}")
    
    try:
        print(f"Response JSON: {json.dumps(response.json(), indent=2)}")
    except:
        print("No se pudo parsear JSON")
    
    if response.status_code == 201:
        print("✅ Registro exitoso!")
        return response.json()
    else:
        print("❌ Error en registro")
        return None


def test_login(email, password):
    """Prueba el endpoint de login."""
    print("\n🧪 Probando inicio de sesión...")
    
    data = {
        "email": email,
        "contraseña": password
    }
    
    response = httpx.post(f"{BASE_URL}/iniciar-sesion", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("✅ Login exitoso!")
        return response.json()
    else:
        print("❌ Error en login")
        return None


def test_cerrar_sesion(token):
    """Prueba el endpoint de cerrar sesión."""
    print("\n🧪 Probando cerrar sesión...")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = httpx.post(f"{BASE_URL}/cerrar-sesion", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("✅ Cierre de sesión exitoso!")
        return True
    else:
        print("❌ Error al cerrar sesión")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("PRUEBAS DE AUTENTICACIÓN - API E-COMMERCE")
    print("=" * 60)
    
    # Test 1: Registro
    registro_result = test_registro()
    
    if registro_result:
        token = registro_result["access_token"]
        email = registro_result["usuario"]["email"]
        
        # Test 2: Login
        login_result = test_login(email, "password123")
        
        if login_result:
            new_token = login_result["access_token"]
            
            # Test 3: Cerrar sesión
            test_cerrar_sesion(new_token)
    
    print("\n" + "=" * 60)
    print("PRUEBAS COMPLETADAS")
    print("=" * 60)
