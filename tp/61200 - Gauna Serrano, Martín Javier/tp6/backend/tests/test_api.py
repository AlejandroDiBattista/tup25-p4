import pytest
from httpx import AsyncClient

import importlib.util
from pathlib import Path

# Cargar el app de main.py directamente por ruta para evitar problemas de import
main_path = Path(__file__).parent.parent / "main.py"
spec = importlib.util.spec_from_file_location("main_module", str(main_path))
main_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(main_mod)
app = main_mod.app


@pytest.mark.asyncio
async def test_register_login_and_list_products():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # registrar
        r = await ac.post("/registrar", json={"nombre":"Test User","email":"test@example.com","password":"secret"})
        assert r.status_code == 201
        # login
        r = await ac.post("/iniciar-sesion", json={"email":"test@example.com","password":"secret"})
        assert r.status_code == 200
        token = r.json().get("access_token")
        assert token
        headers = {"Authorization": f"Bearer {token}"}
        # listar productos
        r = await ac.get("/productos")
        assert r.status_code == 200
        productos = r.json()
        assert isinstance(productos, list)


@pytest.mark.asyncio
async def test_cart_flow():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # registrar y logear otro usuario
        await ac.post("/registrar", json={"nombre":"Cart User","email":"cart@example.com","password":"secret"})
        r = await ac.post("/iniciar-sesion", json={"email":"cart@example.com","password":"secret"})
        token = r.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        # obtener productos y elegir uno con stock
        r = await ac.get("/productos")
        productos = r.json()
        found = None
        for p in productos:
            if p.get("existencia", 0) > 0:
                found = p
                break
        assert found is not None
        # agregar al carrito
        r = await ac.post("/carrito", json={"product_id": found["id"], "cantidad": 1}, headers=headers)
        assert r.status_code == 201
        # ver carrito
        r = await ac.get("/carrito", headers=headers)
        assert r.status_code == 200
        data = r.json()
        assert data.get("items")
