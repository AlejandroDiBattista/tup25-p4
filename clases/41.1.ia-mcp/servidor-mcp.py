from fastmcp import FastMCP
import os

app = FastMCP("mini_fs_secure_token")

BASE_DIR = os.path.abspath("./data")
os.makedirs(BASE_DIR, exist_ok=True)

# --- FUNCIONES DE SEGURIDAD Y ARCHIVOS ---
def ruta_segura(rel_path: str) -> str:
    ruta_abs = os.path.abspath(os.path.join(BASE_DIR, rel_path))
    if not ruta_abs.startswith(BASE_DIR):
        raise ValueError("Acceso denegado: ruta fuera del directorio permitido.")
    return ruta_abs

@app.tool()
def ver_directorio(subdir: str = "."):
    ruta = ruta_segura(subdir)
    if not os.path.exists(ruta):
        return f"Directorio '{subdir}' no encontrado."
    if not os.path.isdir(ruta):
        return f"'{subdir}' no es un directorio."
    return os.listdir(ruta)

@app.tool()
def leer_archivo(nombre: str):
    ruta = ruta_segura(nombre)
    if not os.path.exists(ruta):
        return f"Archivo '{nombre}' no encontrado."
    with open(ruta, "r", encoding="utf-8") as f:
        return f.read()

@app.tool()
def escribir_archivo(nombre: str, contenido: str):
    ruta = ruta_segura(nombre)
    os.makedirs(os.path.dirname(ruta), exist_ok=True)
    with open(ruta, "w", encoding="utf-8") as f:
        f.write(contenido)
    return f"Archivo '{nombre}' escrito con éxito."

@app.tool()
def borrar_archivo(nombre: str):
    ruta = ruta_segura(nombre)
    if not os.path.exists(ruta):
        return f"Archivo '{nombre}' no existe."
    if os.path.isdir(ruta):
        return f"'{nombre}' es un directorio, no un archivo."
    os.remove(ruta)
    return f"Archivo '{nombre}' eliminado."

if __name__ == "__main__":
    app.run()
