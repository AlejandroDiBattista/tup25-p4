FROM python:3.11-slim

# Evitar generación de archivos pyc y habilitar output sin buffer
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copiar requerimientos e instalar
COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip \
    && pip install --no-cache-dir -r /app/requirements.txt

# Copiar el código del backend
COPY . /app

# Exponer puerto
EXPOSE 8000

# Comando por defecto (modo desarrollo con reload)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
