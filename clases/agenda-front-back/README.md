# Sistema de Agenda de Contactos

Sistema full-stack para gestión de contactos con backend en Python (FastAPI) y frontend en Next.js.

## Características

- ✅ CRUD completo de contactos
- ✅ Gestión de múltiples teléfonos por contacto
- ✅ Búsqueda dinámica de contactos
- ✅ Interfaz moderna con Tailwind CSS y shadcn/ui
- ✅ API RESTful con FastAPI
- ✅ Base de datos SQLite con SQLModel
- ✅ **Python 3.13+**: Uso de syntax union types (`|`), `Annotated` types, y otras características modernas

## Estructura del Proyecto

```
nx.5/
├── backend/           # API en Python con FastAPI
│   ├── main.py       # Aplicación principal y endpoints
│   ├── models.py     # Modelos de base de datos
│   ├── schemas.py    # DTOs para validación
│   ├── services.py   # Lógica de negocio
│   ├── database.py   # Configuración de SQLite
│   └── requirements.txt
│
└── frontend/         # Aplicación Next.js
    ├── src/
    │   ├── app/      # Páginas (App Router)
    │   ├── components/ # Componentes React
    │   ├── services/ # Servicios API
    │   └── lib/      # Utilidades
    ├── package.json
    └── tailwind.config.js
```

## Requisitos Previos

- **Python**: 3.13 o superior (requerido)
- **Node.js**: 18 o superior
- **npm** o **yarn**

## Instalación y Ejecución

### Método Rápido (Recomendado)

#### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # En macOS/Linux
# O en Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

Luego para iniciar:
```bash
./start.sh  # En macOS/Linux
# O manualmente:
# source venv/bin/activate && uvicorn main:app --reload
```

El servidor estará disponible en: `http://localhost:8000`
- API docs (Swagger): `http://localhost:8000/docs`
- API docs (ReDoc): `http://localhost:8000/redoc`

#### Frontend
```bash
cd frontend
npm install
```

Luego para iniciar:
```bash
./start.sh  # En macOS/Linux
# O manualmente:
# npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

### Instalación Paso a Paso

#### Backend

1. **Navegar a la carpeta del backend:**
```bash
cd backend
```

2. **Crear un entorno virtual de Python:**
```bash
python3 -m venv venv
```

3. **Activar el entorno virtual:**
```bash
# En macOS/Linux:
source venv/bin/activate

# En Windows:
venv\Scripts\activate
```

4. **Actualizar pip e instalar dependencias:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

5. **Iniciar el servidor:**
```bash
uvicorn main:app --reload
```

#### Frontend

1. **Navegar a la carpeta del frontend:**
```bash
cd frontend
```

2. **Instalar las dependencias:**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

## Uso de la Aplicación

### Listado de Contactos

- La página principal muestra todos los contactos en forma de tarjetas
- Usa el buscador para filtrar contactos por nombre, apellido o email
- Haz clic en cualquier tarjeta para editar el contacto

### Crear un Contacto

1. Haz clic en el botón "Nuevo Contacto"
2. Completa el formulario:
   - Nombre (requerido)
   - Apellido (requerido)
   - Email (requerido)
   - Teléfonos (opcional, puedes agregar múltiples)
3. Usa el botón "+" para agregar más teléfonos
4. Los campos de teléfono vacíos se eliminan automáticamente al guardar
5. Haz clic en "Guardar" para crear el contacto

### Editar un Contacto

1. Haz clic en una tarjeta de contacto
2. Modifica los campos deseados
3. Agrega o elimina teléfonos según necesites
4. Haz clic en "Guardar" para confirmar los cambios
5. O haz clic en "Cancelar" para descartar los cambios

### Eliminar un Contacto

1. Abre la página de edición del contacto
2. Haz clic en el botón "Eliminar Contacto" (rojo)
3. Confirma la eliminación en el diálogo

## API Endpoints

### Contactos

- `GET /api/contacts` - Listar contactos (con búsqueda opcional: `?search=texto`)
- `GET /api/contacts/{id}` - Obtener un contacto específico
- `POST /api/contacts` - Crear un nuevo contacto
- `PUT /api/contacts/{id}` - Actualizar un contacto
- `DELETE /api/contacts/{id}` - Eliminar un contacto

### Ejemplo de Payload (Crear/Actualizar)

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@example.com",
  "phones": [
    "+54 11 1234-5678",
    "+54 11 8765-4321"
  ]
}
```

## Tecnologías Utilizadas

### Backend
- **FastAPI**: Framework web moderno y rápido
- **SQLModel**: ORM basado en Pydantic y SQLAlchemy
- **SQLite**: Base de datos embebida
- **Pydantic**: Validación de datos y DTOs
- **Uvicorn**: Servidor ASGI

### Frontend
- **Next.js 14**: Framework de React con App Router
- **React 18**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de CSS utility-first
- **shadcn/ui**: Componentes de UI reutilizables
- **Lucide React**: Iconos

## Características Técnicas

### Backend
- Uso de dependencias (`Depends`) para inyección de sesiones de base de datos
- DTOs para validación de entrada/salida
- Relaciones uno-a-muchos entre contactos y teléfonos
- Eliminación en cascada de teléfonos
- Búsqueda case-insensitive en múltiples campos
- CORS habilitado para desarrollo

### Frontend
- Arquitectura modular con separación de servicios
- Componentes reutilizables con shadcn/ui
- Cliente API encapsulado
- Navegación con Next.js App Router
- Búsqueda en tiempo real con debouncing implícito
- Gestión dinámica de formularios para teléfonos
- Diseño responsivo

## Mejoras Futuras

- Paginación en el listado de contactos
- Autenticación y autorización
- Validación de formato de teléfonos
- Importación/exportación de contactos (CSV, vCard)
- Categorización de contactos
- Fotos de perfil
- Historial de cambios
- Testing unitario y de integración

## Solución de Problemas

### El backend no inicia
- Verifica que el entorno virtual esté activado
- Asegúrate de haber instalado todas las dependencias
- Revisa que el puerto 8000 no esté en uso

### El frontend no se conecta al backend
- Confirma que el backend esté corriendo en `http://localhost:8000`
- Verifica la configuración de CORS en `backend/main.py`
- Revisa la URL del API en `frontend/src/services/contacts.ts`

### Errores de base de datos
- Elimina el archivo `contacts.db` para reiniciar la base de datos
- El backend creará las tablas automáticamente al iniciar

## Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## Autor

Desarrollado como proyecto de demostración de sistema full-stack.
