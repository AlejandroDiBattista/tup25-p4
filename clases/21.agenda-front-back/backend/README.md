# Backend - API de Agenda de Contactos

API REST desarrollada con FastAPI y SQLModel para gestión de contactos.

## Requisitos

- **Python 3.13 o superior** (requerido para aprovechar las nuevas características del lenguaje)
- pip (gestor de paquetes de Python)

## Instalación

### 1. Crear entorno virtual

```bash
python3 -m venv venv
```

### 2. Activar el entorno virtual

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## Ejecución

### Opción 1: Script automático (macOS/Linux)
```bash
./start.sh
```

### Opción 2: Manual
```bash
source venv/bin/activate  # Activar entorno virtual
uvicorn main:app --reload
```

El servidor iniciará en: **http://localhost:8000**

## Documentación de la API

Una vez el servidor esté corriendo, puedes acceder a:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Endpoints Disponibles

### Contactos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/contacts` | Listar todos los contactos (con búsqueda opcional) |
| GET | `/api/contacts/{id}` | Obtener un contacto específico |
| POST | `/api/contacts` | Crear un nuevo contacto |
| PUT | `/api/contacts/{id}` | Actualizar un contacto existente |
| DELETE | `/api/contacts/{id}` | Eliminar un contacto |

### Ejemplos de Uso

#### Crear un contacto
```bash
curl -X POST "http://localhost:8000/api/contacts" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@example.com",
    "phones": ["+54 11 1234-5678", "+54 11 8765-4321"]
  }'
```

#### Listar contactos
```bash
curl "http://localhost:8000/api/contacts"
```

#### Buscar contactos
```bash
curl "http://localhost:8000/api/contacts?search=juan"
```

#### Obtener un contacto
```bash
curl "http://localhost:8000/api/contacts/1"
```

#### Actualizar un contacto
```bash
curl -X PUT "http://localhost:8000/api/contacts/1" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "email": "juan.perez@example.com",
    "phones": ["+54 11 1234-5678"]
  }'
```

#### Eliminar un contacto
```bash
curl -X DELETE "http://localhost:8000/api/contacts/1"
```

## Estructura del Proyecto

```
backend/
├── main.py          # Aplicación FastAPI y endpoints
├── models.py        # Modelos de base de datos (SQLModel)
├── schemas.py       # DTOs y validación (Pydantic)
├── services.py      # Lógica de negocio
├── database.py      # Configuración de la base de datos
├── requirements.txt # Dependencias de Python
├── start.sh         # Script de inicio
├── contacts.db      # Base de datos SQLite (generada automáticamente)
└── venv/            # Entorno virtual (generado)
```

## Base de Datos

El sistema utiliza **SQLite** como base de datos. El archivo `contacts.db` se crea automáticamente al iniciar el servidor por primera vez.

### Modelos

#### Contact (Contacto)
- `id`: Integer (Primary Key)
- `nombre`: String (Indexado)
- `apellido`: String (Indexado)
- `email`: String (Único, Indexado)
- `phones`: Relación uno-a-muchos con Phone

#### Phone (Teléfono)
- `id`: Integer (Primary Key)
- `number`: String (Indexado)
- `contact_id`: Integer (Foreign Key)

## Características Técnicas

### Validación de Datos
- Uso de Pydantic para validación automática
- DTOs separados para creación, actualización y lectura
- Validación de formato de email

### Base de Datos
- ORM con SQLModel (basado en SQLAlchemy)
- Migraciones automáticas al inicio
- Eliminación en cascada de teléfonos
- Índices para búsqueda eficiente

### Búsqueda
- Búsqueda case-insensitive
- Búsqueda en múltiples campos (nombre, apellido, email)
- Ordenamiento por apellido y nombre

### CORS
- Configurado para permitir conexiones desde el frontend
- Puerto permitido: http://localhost:3000

## Dependencias

- **fastapi**: Framework web moderno
- **uvicorn**: Servidor ASGI
- **sqlmodel**: ORM para Python
- **pydantic**: Validación de datos
- **email-validator**: Validación de emails

## Desarrollo

### Reiniciar la base de datos
Si necesitas reiniciar la base de datos desde cero:
```bash
rm contacts.db
# El archivo se recreará automáticamente al iniciar el servidor
```

### Modo debug
El servidor ya está configurado con `--reload` para recarga automática durante el desarrollo.

## Solución de Problemas

### El servidor no inicia
- Verifica que el entorno virtual esté activado (debe aparecer `(venv)` en el prompt)
- Asegúrate de haber instalado todas las dependencias
- Revisa que el puerto 8000 no esté en uso

### Error de importación de módulos
```bash
# Reinstalar dependencias
pip install -r requirements.txt
```

### Error de base de datos
```bash
# Eliminar y recrear la base de datos
rm contacts.db
# Reiniciar el servidor
```
