"""Script para depurar el endpoint de finalizar compra."""

import requests

BASE_URL = "http://localhost:8000"

# 1. Registrar usuario
print("1. Registrando usuario...")
resp = requests.post(
    f"{BASE_URL}/registrar",
    json={
        "email": "debug@test.com",
        "password": "password123",
        "nombre": "Usuario Debug"
    }
)
print(f"Status: {resp.status_code}")

# 2. Iniciar sesión
print("\n2. Iniciando sesión...")
resp = requests.post(
    f"{BASE_URL}/iniciar-sesion",
    json={
        "email": "debug@test.com",
        "password": "password123"
    }
)
print(f"Status: {resp.status_code}")
token = resp.json()["access_token"]
print(f"Token: {token[:20]}...")

# 3. Agregar producto al carrito
print("\n3. Agregando producto al carrito...")
resp = requests.post(
    f"{BASE_URL}/carrito",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "producto_id": 1,
        "cantidad": 1
    }
)
print(f"Status: {resp.status_code}")
print(f"Response: {resp.json()}")

# 4. Ver carrito
print("\n4. Viendo carrito...")
resp = requests.get(
    f"{BASE_URL}/carrito",
    headers={"Authorization": f"Bearer {token}"}
)
print(f"Status: {resp.status_code}")
print(f"Carrito: {resp.json()}")

# 5. Finalizar compra
print("\n5. Finalizando compra...")
resp = requests.post(
    f"{BASE_URL}/carrito/finalizar",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "direccion": "Av. Corrientes 1234, CABA",
        "tarjeta": "4111111111111111"
    }
)
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    print(f"Response: {resp.json()}")
else:
    print(f"Error: {resp.text}")
