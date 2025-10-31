## Ejecutar la app

Esta app usa Streamlit y la API de OpenAI. La clave se lee primero desde Streamlit Secrets y, si no existe, desde variables de entorno (`.env`).

### Configurar el secreto (recomendado)

- Local: edita el archivo `.streamlit/secrets.toml` y coloca tu clave:

```
OPENAI_API_KEY = "tu_clave_de_openai"
```

- Streamlit Cloud: ve a App → Settings → Secrets y agrega:

```
OPENAI_API_KEY="tu_clave_de_openai"
```

Opcionalmente, también funciona un archivo `.env` con:

```
OPENAI_API_KEY=tu_clave_de_openai
```

### Iniciar

Lanza la app de Streamlit y abre la URL indicada en la terminal.
