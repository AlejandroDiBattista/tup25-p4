from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_listar_productos():
    response = client.get("/productos")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_filtrar_productos():
    response = client.get("/productos?search=Mochila")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert all("Mochila" in producto["nombre"] for producto in data)

def test_registro_usuario():
    response = client.post("/registrar", json={
        "email": "test@example.com",
        "password": "password123",
        "nombre": "Test User"
    })
    assert response.status_code == 200
    assert response.json()["mensaje"] == "Usuario registrado exitosamente"

def test_login_usuario():
    # Primero registramos un usuario
    client.post("/registrar", json={
        "email": "login@example.com",
        "password": "password123",
        "nombre": "Login Test"
    })
    
    # Intentamos iniciar sesión
    response = client.post("/token", data={
        "username": "login@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data

def test_agregar_al_carrito():
    # Primero iniciamos sesión
    login_response = client.post("/token", data={
        "username": "login@example.com",
        "password": "password123"
    })
    token = login_response.json()["access_token"]
    
    # Intentamos agregar un producto al carrito
    response = client.post(
        "/carrito/agregar/1",
        params={"cantidad": 1},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200

def test_finalizar_compra():
    # Primero iniciamos sesión
    login_response = client.post("/token", data={
        "username": "login@example.com",
        "password": "password123"
    })
    token = login_response.json()["access_token"]
    
    # Agregamos un producto al carrito
    client.post(
        "/carrito/agregar/1",
        params={"cantidad": 1},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    # Intentamos finalizar la compra
    response = client.post(
        "/carrito/finalizar",
        json={
            "direccion": "Calle Test 123",
            "tarjeta": "4111111111111111"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "mensaje" in data
    assert "total" in data

def test_ver_historial():
    # Primero iniciamos sesión
    login_response = client.post("/token", data={
        "username": "login@example.com",
        "password": "password123"
    })
    token = login_response.json()["access_token"]
    
    # Intentamos ver el historial
    response = client.get(
        "/compras",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)