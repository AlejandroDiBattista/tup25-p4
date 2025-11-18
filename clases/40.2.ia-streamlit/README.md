# Aplicaciones de IA con Streamlit

## 1. Preparar el entorno (uv)

1. Asegúrate de tener instalada la herramienta `uv` (puedes seguir https://uv-project.org).
2. Sitúate dentro de esta carpeta y, si todavía no lo hiciste, inicializa el workspace:

   ```bash
   cd 40.2.ia-streamlit
   uv init
   ```

3. Crea o actualiza el archivo `pyproject.toml`/`uv.lock` con las dependencias necesarias (ya se incluyen `streamlit`, `openai`, `fastapi`, etc.). Después sincroniza el entorno para instalar las dependencias:

   ```bash
   uv sync
   ```

   `uv sync` construye un entorno reproducible y descarga cada dependencia listada en `uv.lock`.

## 2. Configurar las claves secretas de Streamlit

Streamlit busca un archivo `.streamlit/secrets.toml` en el proyecto. Copia el archivo de ejemplo y coloca tu clave real de OpenAI de esta forma:

```toml
[streamlit]
OPENAI_API_KEY="sk-..."
```

Las apps (`1.responder.py`, `2.charlar.py`, `3.asistente.py`, etc.) usan `st.secrets["OPENAI_API_KEY"]`, así que evita subir el archivo real al repositorio.

## 3. Ejecutar una de las apps

Antes de correr Streamlit, `uv` debe conocer las dependencias fijas (`uv sync`); luego puedes lanzar cualquiera de los scripts dentro del entorno manejado por `uv`:

```bash
./scripts/run_streamlit.sh 1.responder.py
./scripts/run_streamlit.sh 2.charlar.py
```

El script solo es un envoltorio de `uv run streamlit run ...` y garantiza que estés usando el mismo entorno que definiste en `pyproject.toml`.

Si necesitas pasar argumentos adicionales a Streamlit (por ejemplo `--server.headless true`), añádelos al final del comando que recibirá `run_streamlit.sh`.
