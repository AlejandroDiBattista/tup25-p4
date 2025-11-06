import json
from mcp2py import load

server = load("https://mcp.agentdb.dev/WvZ1-CcyHX")

for tool in server.tools:
    print(f"🔧 Tool: {tool.__name__}")
    
    
# Consultar todos los contactos
result = server.execute_sql(statements=[{ "sql": "SELECT * FROM contactos;" }])




print("📇 Contactos en la base de datos:\n")

result = json.loads(result) if isinstance(result, str) else result
rows = result.get("results", [{}])[0].get("rows", [])

for i, contacto in enumerate(rows, 1):
    print(f"{'='*50}\nContacto #{i}\n{'='*50}")
    for key, value in contacto.items():
        print(f"  {key:15s}: {value}")
    print()

print(f"📊 Total: {len(rows)} contacto(s)")
