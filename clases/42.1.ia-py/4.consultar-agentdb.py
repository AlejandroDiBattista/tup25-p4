import requests
import json

# URL de AgentDB
AGENTDB_URL = "https://mcp.agentdb.dev/WvZ1-CcyHX"

def consultar_agentdb(query):
    """Ejecuta una consulta SQL en AgentDB"""
    try:
        response = requests.post(
            f"{AGENTDB_URL}/query",
            json={"sql": query},
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error en la consulta: {e}")
        return None

# Consultar cantidad de registros en agenda_contactos
print("=" * 50)
print("CONSULTA: Cantidad de registros en agenda_contactos")
print("=" * 50)

resultado = consultar_agentdb("SELECT COUNT(*) as total FROM agenda_contactos")
if resultado:
    print(json.dumps(resultado, indent=2, ensure_ascii=False))

print("\n" + "=" * 50)
print("CONSULTA: Todos los contactos")
print("=" * 50)

resultado = consultar_agentdb("SELECT * FROM agenda_contactos")
if resultado:
    print(json.dumps(resultado, indent=2, ensure_ascii=False))
