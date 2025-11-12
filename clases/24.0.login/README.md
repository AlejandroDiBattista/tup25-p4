# Sistema de Autenticación con FastAPI y React

## 📋 Descripción

Este proyecto implementa un sistema completo de autenticación de usuarios con las siguientes características:

- **Backend**: API REST construida con FastAPI y SQLModel
- **Frontend**: Aplicación React (standalone) con interfaz moderna
- **Base de datos**: SQLite para almacenamiento de usuarios
- **Seguridad**: 
  - Contraseñas hasheadas con SHA-256
  - Autenticación basada en tokens
  - Cookies HTTP-only para sesiones seguras
  - Tokens con expiración automática (1 hora)

## ✨ Funcionalidades

- ✅ **Registro de usuarios** (Signup): Crear nuevas cuentas con nombre, email y contraseña
- ✅ **Inicio de sesión** (Login): Autenticación con email y contraseña
- ✅ **Cierre de sesión** (Logout): Invalidar token y eliminar sesión
- ✅ **Perfil de usuario**: Consultar información del usuario autenticado
- ✅ **Persistencia de sesión**: Las sesiones se mantienen entre recargas de página
- ✅ **Validación de email único**: No permite duplicados en el sistema

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos

- Python 3.10 o superior
- `uv` (gestor de paquetes de Python) o `pip`

### Instalación de dependencias

Si usas `uv`:
```bash
uv pip install fastapi uvicorn sqlmodel
```

Si usas `pip`:
```bash
pip install fastapi uvicorn sqlmodel
```

### Ejecución del servidor

1. Navega al directorio del proyecto:
```bash
cd clases/python/24.login
```

2. Ejecuta el servidor:
```bash
uv run login.py
```
o
```bash
python login.py
```

3. El servidor estará disponible en: **http://localhost:8000**

### Acceso a la aplicación

Abre tu navegador y visita:
- **Aplicación web**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs
- **API alternativa**: http://localhost:8000/redoc

## 📁 Estructura del proyecto

```
24.login/
├── login.py          # Backend: API FastAPI con endpoints de autenticación
├── login.html        # Frontend: Aplicación React standalone
├── usuarios.db       # Base de datos SQLite (se crea automáticamente)
└── README.md         # Este archivo
```

## 🔌 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/signup` | Registrar nuevo usuario |
| POST | `/login` | Iniciar sesión |
| GET | `/logout` | Cerrar sesión |
| GET | `/perfil` | Obtener perfil del usuario autenticado |

## 🎯 Flujo de uso

1. **Primera vez**: 
   - Click en "Crear Cuenta Nueva"
   - Completa el formulario de registro
   - El sistema te redirige al login

2. **Login**:
   - Ingresa email y contraseña
   - El sistema crea un token de sesión válido por 1 hora

3. **Usuario autenticado**:
   - Puedes ver tu perfil con información personal
   - El token se envía automáticamente en cada petición

4. **Logout**:
   - Click en "Cerrar Sesión"
   - El token se invalida y vuelves a la página inicial

## 🔐 Seguridad

- Las contraseñas nunca se almacenan en texto plano
- Los tokens expiran automáticamente después de 1 hora
- Las cookies están configuradas como `httponly` y `secure`
- CORS configurado para orígenes específicos

## 🛠️ Tecnologías utilizadas

- **FastAPI**: Framework web moderno y rápido
- **SQLModel**: ORM para manejo de base de datos
- **React 18**: Biblioteca JavaScript para UI
- **Babel**: Transpilador para JSX en el navegador
- **SQLite**: Base de datos embebida

## 📝 Notas

- La base de datos `usuarios.db` se crea automáticamente al iniciar el servidor por primera vez
- Los tokens de sesión tienen una duración de 1 hora
- El sistema valida que no existan emails duplicados al registrarse
