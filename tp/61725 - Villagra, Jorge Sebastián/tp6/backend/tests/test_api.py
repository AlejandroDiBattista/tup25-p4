import os, sys
sys.path.append(str(os.path.dirname(__file__) + "/.."))
from fastapi.testclient import TestClient
from main import app, engine, SQLModel

client = TestClient(app)

EMAIL = "test@example.com"
PASS = "secret123"

def setup_module():
    SQLModel.metadata.create_all(engine)

def register_login():
    client.post("/registrar", json={"nombre":"Tester","email":EMAIL,"password":PASS})
    r = client.post("/iniciar-sesion", json={"email":EMAIL,"password":PASS})
    assert r.status_code == 200
    return r.json()["access_token"]

def auth_headers(t): return {"Authorization": f"Bearer {t}"}

def test_productos():
    r = client.get("/productos")
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_flow_compra():
    token = register_login()
    prods = client.get("/productos").json()
    pid = next(p["id"] for p in prods if p["existencia"] > 0)
    assert client.post("/carrito", json={"producto_id":pid,"cantidad":2}, headers=auth_headers(token)).status_code == 200
    r = client.post("/carrito/finalizar", json={
        "nombre":"Tester",
        "direccion":"Calle 123",
        "telefono":"3815551234",
        "tarjeta":"4111111111111111"
    }, headers=auth_headers(token))
    assert r.status_code == 201
    compra_id = r.json()["compra_id"]
    det = client.get(f"/compras/{compra_id}", headers=auth_headers(token)).json()
    assert det["subtotal"] + det["iva_total"] + det["envio"] == det["total"]

def test_logout():
    token = register_login()
    assert client.post("/cerrar-sesion", headers=auth_headers(token)).status_code == 200
    assert client.get("/carrito", headers=auth_headers(token)).status_code == 401