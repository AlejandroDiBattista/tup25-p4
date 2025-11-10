"""
Configuración y fixtures para tests de la API
"""
import pytest
from fastapi.testclient import TestClient
from sqlmodel import create_engine, SQLModel, Session
from main import app
from database import get_session
import tempfile
import os

# Base de datos temporal para tests
@pytest.fixture(scope="function")
def test_session():
    """Crear una base de datos temporal para cada test"""
    # Crear archivo temporal
    db_fd, db_path = tempfile.mkstemp(suffix=".db")
    os.close(db_fd)
    
    # Crear engine para testing
    engine = create_engine(f"sqlite:///{db_path}", echo=False)
    
    # Crear todas las tablas
    SQLModel.metadata.create_all(engine)
    
    # Crear sesión
    session = Session(engine)
    
    yield session
    
    # Limpiar
    session.close()
    try:
        os.unlink(db_path)
    except PermissionError:
        # En Windows a veces el archivo está bloqueado
        pass

@pytest.fixture(scope="function")
def client(test_session):
    """Cliente de pruebas con base de datos temporal"""
    def get_test_session():
        return test_session
    
    app.dependency_overrides[get_session] = get_test_session
    
    with TestClient(app) as test_client:
        yield test_client
    
    # Limpiar override
    app.dependency_overrides.clear()

@pytest.fixture
def usuario_test_data():
    """Datos de usuario para tests"""
    return {
        "nombre": "Test Usuario",
        "email": "test@example.com",
        "contraseña": "testpass123"
    }

@pytest.fixture
def usuario_registrado(client, usuario_test_data):
    """Usuario registrado en el sistema"""
    response = client.post("/registrar", json=usuario_test_data)
    assert response.status_code == 201
    return {**usuario_test_data, "id": response.json()["id"]}

@pytest.fixture
def usuario_logueado(client, usuario_registrado):
    """Usuario logueado con token"""
    login_data = {
        "email": usuario_registrado["email"],
        "contraseña": usuario_registrado["contraseña"]
    }
    response = client.post("/iniciar-sesion", json=login_data)
    assert response.status_code == 200
    
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    return {
        "usuario": usuario_registrado,
        "token": token,
        "headers": headers
    }

@pytest.fixture
def productos_test_data():
    """Datos de productos para tests"""
    return [
        {
            "titulo": "Producto Test 1",
            "precio": 100.50,
            "descripcion": "Descripción test 1",
            "categoria": "Ropa de hombre",
            "valoracion": 4.5,
            "existencia": 10,
            "imagen": "test1.jpg"
        },
        {
            "titulo": "Producto Test 2", 
            "precio": 50.25,
            "descripcion": "Descripción test 2",
            "categoria": "Electrónicos",
            "valoracion": 3.8,
            "existencia": 5,
            "imagen": "test2.jpg"
        }
    ]

@pytest.fixture
def productos_en_db(test_session, productos_test_data):
    """Productos creados en la base de datos"""
    from models import Producto
    
    productos = []
    for data in productos_test_data:
        producto = Producto(**data)
        test_session.add(producto)
        productos.append(producto)
    
    test_session.commit()
    
    # Refrescar para obtener IDs
    for producto in productos:
        test_session.refresh(producto)
    
    return productos