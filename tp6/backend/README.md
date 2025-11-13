# Backend - API Tienda Electrónica

## Descripción
API RESTful desarrollada con FastAPI y SQLModel para un sitio de comercio electrónico.

## Requisitos
- Python 3.9+
- pip

## Instalación

1. Navega a la carpeta backend:
```bash
cd backend
```

2. Crea un entorno virtual:
```bash
python -m venv venv
```

3. Activa el entorno virtual:
```bash
# En Windows
venv\Scripts\activate
# En Linux/Mac
source venv/bin/activate
```

4. Instala las dependencias:
```bash
pip install -r requirements.txt
```

## Configuración

### Variable de entorno (Importante para producción)
En `security.py`, cambia `SECRET_KEY` por una clave segura en producción.

## Ejecución

Para iniciar el servidor:
```bash
python main.py
```

o usando uvicorn directamente:
```bash
uvicorn main:app --reload
```

El servidor estará disponible en `http://localhost:8000`

### Documentación interactiva
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Pruebas

Para ejecutar las pruebas unitarias:
```bash
pytest test_api.py -v
```

Para ver cobertura:
```bash
pytest test_api.py --cov=. --cov-report=html
```

## Estructura

```
backend/
├── main.py              # Entrada principal de la aplicación
├── models.py            # Modelos SQLModel
├── database.py          # Configuración de BD
├── security.py          # Autenticación y hashing
├── utils.py             # Funciones de utilidad
├── products.json        # Datos iniciales de productos
├── requirements.txt     # Dependencias
├── test_api.py          # Pruebas unitarias
├── routes/
│   ├── __init__.py
│   ├── auth.py          # Endpoints de autenticación
│   ├── productos.py     # Endpoints de productos
│   ├── carrito.py       # Endpoints del carrito
│   └── compras.py       # Endpoints de compras
└── schemas/
    ├── __init__.py
    └── schemas.py       # Esquemas Pydantic
```

## Endpoints principales

### Autenticación
- `POST /api/registrar` - Registrar nuevo usuario
- `POST /api/iniciar-sesion` - Iniciar sesión (obtiene token)
- `POST /api/cerrar-sesion` - Cerrar sesión

### Productos
- `GET /api/productos` - Listar productos (con filtros opcionales)
- `GET /api/productos/{id}` - Detalles de un producto

### Carrito
- `GET /api/carrito` - Ver carrito (requiere autenticación)
- `POST /api/carrito` - Agregar producto al carrito
- `DELETE /api/carrito/{producto_id}` - Quitar producto
- `POST /api/carrito/finalizar` - Finalizar compra
- `POST /api/carrito/cancelar` - Cancelar compra

### Compras
- `GET /api/compras` - Ver resumen de compras
- `GET /api/compras/{id}` - Ver detalle de compra

## Autenticación

La mayoría de los endpoints requieren un token JWT. Para usar:

1. Registra un usuario en `/api/registrar`
2. Inicia sesión en `/api/iniciar-sesion` para obtener el token
3. Usa el token en el header `Authorization: Bearer <token>`

## Reglas de negocio implementadas

- ✅ IVA: 21% para productos normales, 10% para electrónicos
- ✅ Envío: Gratis para compras > $1000, $50 en otros casos
- ✅ Control de existencia: No se puede vender más de lo disponible
- ✅ Autenticación: Solo usuarios autenticados pueden comprar
- ✅ Carrito: Se vacía al finalizar compra

## Base de datos

Se usa SQLite por defecto. La BD se crea automáticamente en `tienda.db`.

Al iniciar, se cargan automáticamente los productos desde `productos.json`.
