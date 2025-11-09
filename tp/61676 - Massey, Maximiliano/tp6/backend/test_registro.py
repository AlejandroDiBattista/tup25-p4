"""Script para probar el endpoint de registro directamente"""
import requests
import json

url = "http://localhost:8000/registrar"
data = {
    "nombre": "Test User",
    "email": "test999@example.com",
    "password": "123456"
}

headers = {
    "Content-Type": "application/json",
    "Origin": "http://localhost:3000"
}

try:
    print(f"Enviando petición POST a {url}")
    print(f"Datos: {json.dumps(data, indent=2)}")
    
    response = requests.post(url, json=data, headers=headers, timeout=10)
    
    print(f"\n✅ Respuesta recibida:")
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print(f"Body: {response.text}")
    
except requests.exceptions.Timeout:
    print("❌ Timeout - el servidor no respondió")
except requests.exceptions.ConnectionError as e:
    print(f"❌ Error de conexión: {e}")
except Exception as e:
    print(f"❌ Error: {e}")
