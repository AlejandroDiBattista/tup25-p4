# Generar modelos de IA con Streamlit y OpenAI

1. Configuracion

Para usar OpenAI con Streamlit, primero debes instalar las bibliotecas necesarias:

```bash
uv init 
uv add streamlit openai
```

Luego debemos configurar la clave API de OpenAI en Streamlit. Puedes hacerlo agregando la clave a tu archivo `secrets.toml`:

```toml
# .streamlit/secrets.toml
OPENAI_API_KEY="tu_clave_api_aqui"
``` 

La clave API se puede obtener desde la cuenta de OpenAI.

## 2. Ejecutar las apps con `uv`

Una vez que hayas instalado las dependencias y sincronizado el entorno (`uv sync`), inicia cualquiera de las apps Streamlit con:

```bash
uv run streamlit run 1.responder.py
uv run streamlit run 2.charlar.py
```

`uv run` se asegura de usar el entorno gestionado y las dependencias fijadas en `pyproject.toml`/`uv.lock`.

Si necesitas pasar opciones adicionales a Streamlit (por ejemplo `--server.headless true`), añádelas después del nombre del archivo.

## 3. Clave de OpenAI en Streamlit

La clave debe vivir en `.streamlit/secrets.toml` bajo la clave `OPENAI_API_KEY`. Streamlit la carga automáticamente como `st.secrets['OPENAI_API_KEY']`, así que las apps (`1.responder.py`, `2.charlar.py`, etc.) pueden crear el cliente OpenAI directamente.
