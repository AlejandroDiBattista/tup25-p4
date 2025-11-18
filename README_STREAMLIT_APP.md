# Traductor Inglés → Español en Streamlit

Este proyecto añade una pequeña interfaz gráfica con `streamlit` que pide un fragmento en inglés y usa el `OpenAI Response API` para devolver una traducción en español.

## Requisitos
- Python 3.14 o superior (según `pyproject.toml`).
- Clave de OpenAI válida con permisos para el modelo `gpt-4.1-mini`.
- Dependencias listadas en `pyproject.toml` (incluyen `streamlit` y `openai`).

## Configuración de la clave
1. Crea una variable de entorno `OPENAI_API_KEY`:
   ```bash
   export OPENAI_API_KEY="tu_clave"
   ```
2. Alternativamente, define la clave dentro de `st.secrets.toml` (por ejemplo en `.streamlit/secrets.toml`):
   ```toml
   OPENAI_API_KEY = "tu_clave"
   ```

## Instalación y ejecución
1. Instala las dependencias:
   ```bash
   pip install .
   ```
2. Ejecuta la app Streamlit:
   ```bash
   streamlit run streamlit_app.py
   ```

## Flujo de uso
1. Escribe o pega un texto en inglés dentro de la caja "Texto en inglés".
2. Presiona “Traducir ahora” para enviar la solicitud a OpenAI.
3. La traducción se muestra en el recuadro inferior.
4. Si falta la clave o aparece un error de OpenAI, la app muestra avisos específicos.

## Consideraciones
- El modelo empleado es `gpt-4.1-mini` con temperatura baja para priorizar literalidad.
- Puedes usar la misma clave que utilizas con `openai` en consola.