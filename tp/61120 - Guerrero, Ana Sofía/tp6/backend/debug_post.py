from fastapi.testclient import TestClient
import json

from main import app

client = TestClient(app)

payload = {"nombre": "sofu", "email": "sofi@gmil.com", "contraseña": "123456"}

resp = client.post('/api/registrar', json=payload)
print('status_code:', resp.status_code)
try:
    print('json:', resp.json())
except Exception as e:
    print('response text:', resp.text)
    print('error reading json:', e)
