# Ejecutar backend en Docker (dev)

Este README explica cómo construir y ejecutar el backend dentro de un contenedor con Python 3.11.

Requisitos
- Docker instalado en tu máquina.

Construir la imagen (desde la carpeta raíz del repo o desde `tp6`):

```powershell
# situarse en tp6/backend
cd .\backend
# construir la imagen (nombre: tp6-backend)
docker build -t tp6-backend .
```

Ejecutar el contenedor:

```powershell
# mapa puerto 8000 del contenedor al 8000 del host
docker run --rm -p 8000:8000 --name tp6-backend-dev tp6-backend
```

Notas:
- El `Dockerfile` usa Python 3.11-slim y `requirements.txt` del directorio `backend` para instalar dependencias. Esto mantiene compatibilidad con `sqlmodel` y Pydantic v1 tal como está fijado en el proyecto.
- El `--reload` en el comando de `uvicorn` es útil para desarrollo (hot-reload). En producción se recomienda eliminar `--reload` y usar configuraciones más robustas.
- Si quieres montar tu carpeta para desarrollo con cambios en caliente (sin rebuild) puedes ejecutar en lugar de `docker run`:

```powershell
docker run --rm -p 8000:8000 -v ${PWD}:/app --name tp6-backend-dev tp6-backend
```

(En PowerShell, asegúrate de ejecutar desde `tp6\backend` para que `${PWD}` apunte al directorio correcto.)
