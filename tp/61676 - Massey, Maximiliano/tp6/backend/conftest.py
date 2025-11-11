"""Configuración de fixtures para pytest"""
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from main import app, get_db
from models.productos import Producto
from models.usuarios import Usuario
from models.carrito import ItemCarrito
from models.compras import Compra, CompraItem

# Base de datos de prueba en memoria
@pytest.fixture(name="session")
def session_fixture():
    """Crea una sesión de base de datos en memoria para tests"""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Cargar productos de prueba
        productos_prueba = [
            Producto(
                id=1,
                nombre="Mochila Test",
                titulo="Mochila Test",
                descripcion="Mochila para pruebas",
                precio=99.99,
                categoria="Test",
                existencia=10,
                imagen="imagenes/test.png",
                valoracion=4.5
            ),
            Producto(
                id=2,
                nombre="Camiseta Test",
                titulo="Camiseta Test",
                descripcion="Camiseta para pruebas",
                precio=19.99,
                categoria="Test",
                existencia=5,
                imagen="imagenes/test2.png",
                valoracion=4.0
            ),
            Producto(
                id=3,
                nombre="Producto Sin Stock",
                titulo="Producto Sin Stock",
                descripcion="Producto sin existencias",
                precio=49.99,
                categoria="Test",
                existencia=0,
                imagen="imagenes/test3.png",
                valoracion=3.5
            ),
        ]
        
        for producto in productos_prueba:
            session.add(producto)
        session.commit()
        
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    """Cliente de prueba con sesión de BD en memoria"""
    def get_db_override():
        return session

    app.dependency_overrides[get_db] = get_db_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="usuario_test")
def usuario_test_fixture(client: TestClient):
    """Crea un usuario de prueba y devuelve sus credenciales"""
    email = "test@example.com"
    password = "password123"
    nombre = "Usuario Test"
    
    # Registrar usuario
    response = client.post("/registrar", json={
        "email": email,
        "password": password,
        "nombre": nombre
    })
    
    assert response.status_code == 200
    
    return {
        "email": email,
        "password": password,
        "nombre": nombre
    }


@pytest.fixture(name="token_usuario")
def token_usuario_fixture(client: TestClient, usuario_test):
    """Devuelve un token de autenticación válido"""
    response = client.post("/token", data={
        "username": usuario_test["email"],
        "password": usuario_test["password"]
    })
    
    assert response.status_code == 200
    data = response.json()
    return data["access_token"]


@pytest.fixture(name="headers_auth")
def headers_auth_fixture(token_usuario):
    """Devuelve headers con autenticación"""
    return {"Authorization": f"Bearer {token_usuario}"}
