# TP6 - Tienda Electrónica (2do Parcial)

## Descripción General

Proyecto de un sitio de comercio electrónico completo con frontend y backend, desarrollado como trabajo práctico evaluable.

**Fecha de Entrega**: Miércoles 12 de Noviembre (21hs a 22hs)

## Estructura del Proyecto

```
tp6/
├── backend/              # API FastAPI
│   ├── main.py          # Entrada principal
│   ├── models.py        # Modelos SQLModel
│   ├── database.py      # Configuración BD
│   ├── security.py      # Autenticación
│   ├── utils.py         # Utilidades
│   ├── requirements.txt  # Dependencias Python
│   ├── productos.json   # Datos iniciales
│   ├── test_api.py      # Pruebas unitarias
│   ├── routes/          # Endpoints de API
│   │   ├── auth.py
│   │   ├── productos.py
│   │   ├── carrito.py
│   │   └── compras.py
│   └── schemas/         # Esquemas Pydantic
│       └── schemas.py
│
└── frontend/            # SPA Next.js
    ├── app/            # App Router
    │   ├── page.tsx    # Inicio
    │   ├── login/
    │   ├── registro/
    │   ├── carrito/
    │   ├── checkout/
    │   ├── compras/
    │   └── globals.css
    ├── components/     # Componentes React
    ├── lib/           # Utilidades
    ├── store/         # Zustand stores
    ├── package.json
    └── tailwind.config.js
```

## Inicio Rápido

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

El backend estará en: http://localhost:8000
Documentación API: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará en: http://localhost:3000

## Funcionalidades Implementadas

### Autenticación
- ✅ Registro de usuario
- ✅ Inicio de sesión
- ✅ Cierre de sesión
- ✅ JWT tokens

### Productos
- ✅ Listado de productos
- ✅ Búsqueda por nombre/descripción
- ✅ Filtro por categoría
- ✅ Detalles del producto
- ✅ Control de existencia

### Carrito
- ✅ Agregar productos
- ✅ Quitar productos
- ✅ Ver contenido
- ✅ Cálculo de totales
- ✅ Cancelar compra

### Compra
- ✅ Checkout con dirección y tarjeta
- ✅ Cálculo de IVA (21% normal, 10% electrónica)
- ✅ Cálculo de envío ($50 o gratis >$1000)
- ✅ Registro de compra
- ✅ Reducción de existencia

### Historial
- ✅ Ver resumen de compras
- ✅ Ver detalle de compra

## Tecnologías

### Backend
- FastAPI 0.104.1
- SQLModel + SQLite
- Pydantic
- JWT para autenticación
- bcrypt para hashing

### Frontend
- Next.js 14
- React 18
- Zustand para state management
- Tailwind CSS
- Lucide React (iconos)
- Axios

## Testing

### Backend - Pruebas unitarias

```bash
cd backend
pytest test_api.py -v
```

Se incluyen pruebas para:
- Registro e inicio de sesión
- Obtención de productos
- Operaciones de carrito
- Cálculo de totales

## Reglas de Negocio

1. **IVA**: 21% para productos normales, 10% para electrónicos
2. **Envío**: Gratis para compras > $1000, $50 en otros casos
3. **Existencia**: No se puede vender más del disponible
4. **Autenticación**: Solo usuarios autenticados pueden comprar
5. **Carrito**: Se vacía al finalizar compra

## Datos Iniciales

El backend carga automáticamente los productos desde `productos.json` al iniciar.

Incluye 10 productos de ejemplo:
- Laptops
- Monitores
- Periféricos
- Accesorios

## Configuración

### Variables de Entorno (Frontend)

Crear archivo `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Seguridad (Backend)

En `backend/security.py`, cambiar `SECRET_KEY` en producción.

## API Endpoints

### Autenticación
- `POST /api/registrar`
- `POST /api/iniciar-sesion`
- `POST /api/cerrar-sesion`

### Productos
- `GET /api/productos` (con filtros)
- `GET /api/productos/{id}`

### Carrito
- `GET /api/carrito`
- `POST /api/carrito`
- `DELETE /api/carrito/{producto_id}`
- `POST /api/carrito/finalizar`
- `POST /api/carrito/cancelar`

### Compras
- `GET /api/compras`
- `GET /api/compras/{id}`

## Documentación Adicional

- Ver `backend/README.md` para detalles del API
- Ver `frontend/README.md` para detalles del frontend

## Notas Importantes

1. La BD SQLite se crea automáticamente en `backend/tienda.db`
2. Las imágenes de los productos son URLs de ejemplo
3. No se almacenan datos reales de tarjetas de crédito
4. CORS está habilitado para desarrollo local
5. El token JWT expira en 30 minutos

## Archivos Importantes

- `productos.json`: Datos iniciales de productos
- `test_api.py`: Suite de pruebas
- `main.py` (backend): Punto de entrada
- `page.tsx` (frontend): Página principal

## Problemas Comunes

**El frontend no se conecta al backend**
- Verificar que el backend esté ejecutándose en puerto 8000
- Verificar CORS en `backend/main.py`
- Verificar URL en `.env.local`

**El token no funciona**
- Verificar que la BD fue creada correctamente
- Reiniciar backend y frontend
- Limpiar localStorage del navegador

**Los productos no cargan**
- Verificar que `productos.json` está en la carpeta `backend/`
- Revisar logs del backend

## Autor

Alumna: Guerrero, Ana Sofía
Legajo: 61120
Materia: Programación 4
Fecha: 12 de Noviembre de 2025
