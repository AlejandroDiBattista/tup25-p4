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
