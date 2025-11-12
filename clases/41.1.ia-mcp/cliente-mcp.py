class MiniFSClient:
    def __init__(self, url, token):
        self.url = url
        self.token = token

    def _call(self, name, args=None):
        r = requests.post(
            f"{self.url}/call_tool",
            json={"name": name, "arguments": args or {}},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        r.raise_for_status()
        return r.json()

    def ver(self, subdir="."):
        return self._call("ver_directorio", {"subdir": subdir})

    def leer(self, nombre):
        return self._call("leer_archivo", {"nombre": nombre})

    def escribir(self, nombre, contenido):
        return self._call("escribir_archivo", {"nombre": nombre, "contenido": contenido})

    def borrar(self, nombre):
        return self._call("borrar_archivo", {"nombre": nombre})

# Ejemplo:
fs = MiniFSClient("http://localhost:8080", "supersecreto123")
print(fs.ver())
