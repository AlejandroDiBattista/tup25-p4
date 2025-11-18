import pytest
from fastapi.testclient import TestClient
from sqlmodel import create_engine, SQLModel, Session
from sqlmodel.pool import StaticPool
import sys
import os

# Agregar el directorio backend al path
sys.path.insert(0, os.path.dirname(__file__))

from main import app
from database import get_session
from models import Usuario, Producto, Carrito
from security import hash_password

# Crear una BD de prueba en memoria
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_registrar_usuario(client: TestClient):
    """Test para registrar un nuevo usuario"""
    response = client.post(
        "/api/registrar",
        json={
            "nombre": "Test User",
            "email": "test@example.com",
            "contraseña": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["nombre"] == "Test User"


def test_registrar_usuario_duplicado(client: TestClient):
    """Test para registrar un usuario con email duplicado"""
    # Registrar el primer usuario
    client.post(
        "/api/registrar",
        json={
            "nombre": "Test User",
            "email": "test@example.com",
            "contraseña": "password123"
        }
    )
    
    # Intentar registrar con el mismo email
    response = client.post(
        "/api/registrar",
        json={
            "nombre": "Another User",
            "email": "test@example.com",
            "contraseña": "password456"
        }
    )
    assert response.status_code == 400
    assert "ya está registrado" in response.json()["detail"]


def test_iniciar_sesion(client: TestClient):
    """Test para iniciar sesión"""
    # Registrar un usuario
    client.post(
        "/api/registrar",
        json={
            "nombre": "Test User",
            "email": "test@example.com",
            "contraseña": "password123"
        }
    )
    
    # Iniciar sesión
    response = client.post(
        "/api/iniciar-sesion",
        json={
            "email": "test@example.com",
            "contraseña": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["usuario"]["email"] == "test@example.com"


def test_iniciar_sesion_fallido(client: TestClient):
    """Test para iniciar sesión con credenciales incorrectas"""
    response = client.post(
        "/api/iniciar-sesion",
        json={
            "email": "noexiste@example.com",
            "contraseña": "password123"
        }
    )
    assert response.status_code == 401
    assert "Email o contraseña" in response.json()["detail"]


def test_cerrar_sesion(client: TestClient):
    """Test para cerrar sesión"""
    response = client.post("/api/cerrar-sesion")
    assert response.status_code == 200
    assert response.json()["mensaje"] == "Sesión cerrada exitosamente"


def test_obtener_productos(session: Session, client: TestClient):
    """Test para obtener lista de productos"""
    # Agregar algunos productos a la BD
    session.add(Producto(
        nombre="Laptop",
        descripcion="Computadora portátil",
        precio=1500.00,
        categoria="Electrónica",
        existencia=5,
        es_electronico=True
    ))
    session.add(Producto(
        nombre="Teclado",
        descripcion="Teclado mecánico",
        precio=100.00,
        categoria="Accesorios",
        existencia=10
    ))
    session.commit()
    
    response = client.get("/api/productos")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_obtener_productos_por_categoria(session: Session, client: TestClient):
    """Test para obtener productos filtrados por categoría"""
    session.add(Producto(
        nombre="Laptop",
        descripcion="Computadora portátil",
        precio=1500.00,
        categoria="Electrónica",
        existencia=5,
        es_electronico=True
    ))
    session.add(Producto(
        nombre="Teclado",
        descripcion="Teclado mecánico",
        precio=100.00,
        categoria="Accesorios",
        existencia=10
    ))
    session.commit()
    
    response = client.get("/api/productos?categoria=Electrónica")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["nombre"] == "Laptop"


def test_obtener_productos_por_busqueda(session: Session, client: TestClient):
    """Test para buscar productos"""
    session.add(Producto(
        nombre="Laptop Gaming",
        descripcion="Computadora portátil para juegos",
        precio=2000.00,
        categoria="Electrónica",
        existencia=3,
        es_electronico=True
    ))
    session.add(Producto(
        nombre="Teclado Mecánico",
        descripcion="Teclado para gaming",
        precio=150.00,
        categoria="Accesorios",
        existencia=10
    ))
    session.commit()
    
    response = client.get("/api/productos?busqueda=gaming")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_obtener_producto_especifico(session: Session, client: TestClient):
    """Test para obtener detalles de un producto"""
    producto = Producto(
        nombre="Monitor",
        descripcion="Monitor 27 pulgadas",
        precio=300.00,
        categoria="Electrónica",
        existencia=5,
        es_electronico=True
    )
    session.add(producto)
    session.commit()
    session.refresh(producto)
    
    response = client.get(f"/api/productos/{producto.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["nombre"] == "Monitor"


def test_obtener_producto_inexistente(client: TestClient):
    """Test para obtener un producto que no existe"""
    response = client.get("/api/productos/999")
    assert response.status_code == 404
    assert "no encontrado" in response.json()["detail"]


def test_agregar_producto_al_carrito(session: Session, client: TestClient):
    """Test para agregar producto al carrito"""
    # Registrar y login
    client.post(
        "/api/registrar",
        json={
            "nombre": "Test User",
            "email": "test@example.com",
            "contraseña": "password123"
        }
    )
    login_response = client.post(
        "/api/iniciar-sesion",
        json={
            "email": "test@example.com",
            "contraseña": "password123"
        }
    )
    token = login_response.json()["access_token"]
    
    # Crear un producto
    producto = Producto(
        nombre="Laptop",
        descripcion="Computadora portátil",
        precio=1500.00,
        categoria="Electrónica",
        existencia=5,
        es_electronico=True
    )
    session.add(producto)
    session.commit()
    session.refresh(producto)
    
    # Agregar al carrito
    response = client.post(
        f"/api/carrito?producto_id={producto.id}&cantidad=2",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert "agregado" in response.json()["mensaje"]


def test_agregar_producto_inexistente(client: TestClient):
    """Test para agregar producto inexistente al carrito"""
    client.post(
        "/api/registrar",
        json={
            "nombre": "Test User",
            "email": "test@example.com",
            "contraseña": "password123"
        }
    )
    login_response = client.post(
        "/api/iniciar-sesion",
        json={
            "email": "test@example.com",
            "contraseña": "password123"
        }
    )
    token = login_response.json()["access_token"]
    
    response = client.post(
        "/api/carrito?producto_id=999&cantidad=1",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404


def test_obtener_carrito(session: Session, client: TestClient):
    """Test para obtener contenido del carrito"""
    # Registrar y login
    client.post(
        "/api/registrar",
        json={
            "nombre": "Test User",
            "email": "test@example.com",
            "contraseña": "password123"
        }
    )
    login_response = client.post(
        "/api/iniciar-sesion",
        json={
            "email": "test@example.com",
            "contraseña": "password123"
        }
    )
    token = login_response.json()["access_token"]
    
    # Crear un producto
    producto = Producto(
        nombre="Laptop",
        descripcion="Computadora portátil",
        precio=1500.00,
        categoria="Electrónica",
        existencia=5,
        es_electronico=True
    )
    session.add(producto)
    session.commit()
    session.refresh(producto)
    
    # Agregar al carrito
    client.post(
        f"/api/carrito?producto_id={producto.id}&cantidad=2",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    # Obtener carrito
    response = client.get(
        "/api/carrito",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["estado"] == "activo"
    assert "total" in data
    assert "subtotal" in data
