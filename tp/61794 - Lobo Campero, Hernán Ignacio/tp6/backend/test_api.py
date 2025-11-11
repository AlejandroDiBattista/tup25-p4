import pytest
from fastapi.testclient import TestClient


def test_root(client: TestClient):
    """Test: Endpoint raíz devuelve bienvenida"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "mensaje" in data


def test_obtener_productos(client: TestClient):
    """Test: GET /api/productos devuelve lista"""
    response = client.get("/api/productos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_obtener_categorias(client: TestClient):
    """Test: GET /api/categorias devuelve lista"""
    response = client.get("/api/categorias")
    assert response.status_code == 200
    data = response.json()
    # El endpoint devuelve {'categorias': [...]}
    assert "categorias" in data
    assert isinstance(data["categorias"], list)


def test_buscar_productos(client: TestClient):
    """Test: Buscar productos"""
    response = client.get("/api/productos?busqueda=test")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_carrito_sin_token(client: TestClient):
    """Test: Carrito sin token debe retornar 401"""
    response = client.get("/api/carrito")
    assert response.status_code == 401


def test_compras_sin_token(client: TestClient):
    """Test: Compras sin token debe retornar 401"""
    response = client.get("/api/compras")
    assert response.status_code == 401


