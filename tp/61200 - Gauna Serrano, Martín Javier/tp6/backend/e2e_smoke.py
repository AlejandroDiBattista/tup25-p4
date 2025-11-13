import time
import json
import random
import sys

try:
    import httpx
except Exception:
    print("httpx no está instalado. Ejecuta: pip install httpx")
    sys.exit(1)

BASE = "http://localhost:8000"

def pretty(resp):
    try:
        return json.dumps(resp.json(), indent=2, ensure_ascii=False)
    except Exception:
        return str(resp.text)


def main():
    s = httpx.Client(timeout=10.0)

    # Registrar usuario con email aleatorio
    ts = int(time.time())
    email = f"testuser_{ts}@example.local"
    print(f"Registrando usuario {email} ...")
    r = s.post(f"{BASE}/registrar", json={"nombre": "Test User", "email": email, "password": "secret"})
    print(r.status_code, pretty(r))
    if r.status_code != 201:
        print("Registro falló, saliendo")
        return

    # Iniciar sesion
    print("Iniciando sesión...")
    r = s.post(f"{BASE}/iniciar-sesion", json={"email": email, "password": "secret"})
    print(r.status_code, pretty(r))
    if r.status_code != 200:
        print("Login falló, saliendo")
        return
    token = r.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}

    # Listar productos
    print("Listando productos...")
    r = s.get(f"{BASE}/productos")
    print(r.status_code)
    try:
        productos = r.json()
    except Exception:
        print("No se pudo parsear productos:", r.text)
        return
    if not productos:
        print("No hay productos registrados")
        return
    print(f"Encontrados {len(productos)} productos, mostrando primero:")
    print(json.dumps(productos[0], indent=2, ensure_ascii=False))

    # Elegir primer producto con existencia > 0
    prod = None
    for p in productos:
        if p.get("existencia", 0) > 0:
            prod = p
            break
    if not prod:
        print("No hay productos con stock > 0 para agregar al carrito")
        return
    print(f"Usando producto {prod['id']} -> {prod['nombre']}")

    # Agregar al carrito
    print("Agregando al carrito...")
    r = s.post(f"{BASE}/carrito", json={"product_id": prod['id'], "cantidad": 1}, headers=headers)
    print(r.status_code, pretty(r))
    if r.status_code not in (200,201):
        print("Fallo add to cart")
        return

    # Ver carrito
    print("Verificando carrito...")
    r = s.get(f"{BASE}/carrito", headers=headers)
    print(r.status_code, pretty(r))

    # Finalizar compra
    print("Finalizando compra...")
    payload = {"direccion": "Calle Falsa 123", "tarjeta": "4111111111111111"}
    r = s.post(f"{BASE}/carrito/finalizar", json=payload, headers=headers)
    print(r.status_code, pretty(r))
    if r.status_code != 200:
        print("Finalizar fallo")
        return
    purchase_id = None
    try:
        purchase_id = r.json().get("purchase_id")
    except Exception:
        pass

    # Listar compras
    print("Listando compras...")
    r = s.get(f"{BASE}/compras", headers=headers)
    print(r.status_code, pretty(r))

    print("E2E completado. purchase_id:", purchase_id)

if __name__ == '__main__':
    main()
