# 📋 Plan de Desarrollo - TP6 E-Commerce

**Estudiante:** Lucas David Paz Berrondo (Legajo: 61312)  
**Proyecto:** Sistema de comercio electrónico con FastAPI + Next.js  
**Objetivo:** Mínimo 10 commits siguiendo estrictamente GUIAPROYECTO.md

---

## 🔍 Análisis del Estado Actual

### ✅ Lo que ya existe:
- **Backend básico:** FastAPI con endpoint `/productos` (solo lectura)
- **Frontend básico:** Next.js con listado de productos
- **Datos:** 20 productos en `productos.json` con imágenes
- **Modelo inicial:** `Producto` en SQLModel (estructura básica)

### ❌ Lo que FALTA (según GUIAPROYECTO.md):

#### **Base de Datos (CRÍTICO):**
- [ ] Modelo `Usuario` (id, nombre, email, contraseña_hash)
- [ ] Modelo `Carrito` (id, usuario_id, estado, productos)
- [ ] Modelo `ItemCarrito` (producto_id, cantidad)
- [ ] Modelo `Compra` (id, usuario_id, fecha, dirección, tarjeta, total, envío)
- [ ] Modelo `ItemCompra` (producto_id, cantidad, nombre, precio_unitario)
- [ ] Migraciones y persistencia en SQLite

#### **Backend API (11 endpoints faltantes):**
- [ ] POST `/registrar` - Registro de usuario
- [ ] POST `/iniciar-sesion` - Login con JWT
- [ ] POST `/cerrar-sesion` - Logout
- [ ] GET `/productos` - ✅ EXISTE (agregar filtros categoría/búsqueda)
- [ ] GET `/productos/{id}` - Detalle de producto
- [ ] POST `/carrito` - Agregar al carrito
- [ ] DELETE `/carrito/{product_id}` - Quitar del carrito
- [ ] GET `/carrito` - Ver carrito
- [ ] POST `/carrito/finalizar` - Finalizar compra
- [ ] POST `/carrito/cancelar` - Cancelar compra
- [ ] GET `/compras` - Resumen de compras
- [ ] GET `/compras/{id}` - Detalle de compra

#### **Autenticación:**
- [ ] Sistema de tokens JWT
- [ ] Middleware de autenticación
- [ ] Hash de contraseñas (bcrypt/passlib)

#### **Lógica de Negocio (REGLAS ESTRICTAS):**
- [ ] Validar existencia antes de agregar al carrito
- [ ] Cálculo de IVA: 21% general, 10% electrónica
- [ ] Envío: Gratis >$1000, sino $50
- [ ] Control de estado del carrito
- [ ] Actualización de stock al finalizar compra

#### **Frontend (4 pantallas):**
- [ ] Pantalla de registro/login
- [ ] Pantalla de productos con búsqueda/filtros + carrito
- [ ] Pantalla de checkout (dirección + tarjeta)
- [ ] Pantalla de historial de compras

#### **Testing:**
- [ ] Tests unitarios para endpoints (pytest)
- [ ] Archivo `api-tests.http` completo

---

## 🎯 Plan de Commits (Mínimo 10)

### **✅ COMMIT 1: Configurar modelos de base de datos** [COMPLETADO]
**Archivos modificados:** 
- `backend/models/productos.py` - Todos los modelos creados
- `backend/models/__init__.py` - Exports configurados
- `backend/database.py` - Engine y session de SQLite
- `backend/main.py` - Inicialización de DB y carga de productos
- `backend/verificar_modelos.py` - Script de verificación

**Tareas completadas:**
- ✅ Crear modelo `Usuario` (id, nombre, email, contraseña)
- ✅ Crear modelo `Carrito` (id, usuario_id, estado) con relaciones
- ✅ Crear modelo `ItemCarrito` (carrito_id, producto_id, cantidad)
- ✅ Crear modelo `Compra` (id, usuario_id, fecha, dirección, tarjeta, total, envío)
- ✅ Crear modelo `ItemCompra` (compra_id, producto_id, cantidad, nombre, precio_unitario)
- ✅ Mejorar modelo `Producto` (agregado campo imagen)
- ✅ Crear engine y session de SQLite en `database.py`
- ✅ Configurar evento startup para crear tablas
- ✅ Cargar 20 productos iniciales desde JSON

**Validación:** ✅ Todos los modelos creados y verificados - 6 tablas en la DB

---

### **✅ COMMIT 2: Implementar sistema de autenticación (JWT + hashing)** [COMPLETADO]
**Archivos creados:**
- `backend/auth.py` - Funciones de hash y JWT
- `backend/dependencies.py` - Dependency get_current_user
- `backend/test_auth.py` - Script de pruebas

**Dependencias instaladas:**
- ✅ `python-jose[cryptography]>=3.3.0` - Para JWT
- ✅ `bcrypt>=4.0.1` - Para hash de contraseñas  
- ✅ `python-multipart>=0.0.18` - Para formularios OAuth2

**Tareas completadas:**
- ✅ Instalar dependencias de autenticación
- ✅ Crear `obtener_hash_contraseña()` con bcrypt
- ✅ Crear `verificar_contraseña()` para validación
- ✅ Crear `crear_access_token()` para generar JWT
- ✅ Crear `verificar_token()` para decodificar JWT
- ✅ Crear `get_current_user()` dependency con OAuth2
- ✅ Configurar SECRET_KEY y ALGORITHM (HS256)
- ✅ Probar hash de contraseñas (✅ funciona)
- ✅ Probar tokens JWT (✅ funciona)

**Validación:** ✅ Sistema de autenticación probado y funcionando correctamente

---

### **✅ COMMIT 3: Endpoints de autenticación (registrar, login, logout)** [COMPLETADO]
**Archivo modificado:** `backend/main.py`
**Archivos de prueba:** `backend/test_auth_endpoints.py`

**Dependencias agregadas:**
- ✅ `email-validator>=2.0.0` - Para validación de EmailStr en Pydantic

**Modelos Pydantic creados:**
- ✅ `RegistroRequest` - Para registro de usuario (nombre, email, password)
- ✅ `LoginRequest` - Para inicio de sesión (email, password)
- ✅ `TokenResponse` - Para respuesta de token JWT
- ✅ `MensajeResponse` - Para mensajes generales

**Tareas completadas:**
- ✅ Implementar POST `/registrar` - Crear usuario con contraseña hasheada
  - Valida email único (error 400 si existe)
  - Hashea contraseña con bcrypt
  - Crea usuario en base de datos
  - Crea carrito activo automáticamente
  - Retorna status 201 Created

- ✅ Implementar POST `/iniciar-sesion` - Validar credenciales y retornar JWT
  - Busca usuario por email
  - Verifica contraseña con bcrypt
  - Genera token JWT con 30 min de expiración
  - Retorna access_token y token_type
  - Error 401 Unauthorized si credenciales inválidas

- ✅ Implementar POST `/cerrar-sesion` - Invalidar token (requiere autenticación)
  - Usa dependency `get_current_user`
  - Requiere Bearer token en headers
  - Retorna mensaje de confirmación
  - Error 401 si no hay token

**Validación:** ✅ Endpoints implementados según especificaciones de GUIAPROYECTO.md - Código validado contra `api-tests.http`

---

### **✅ COMMIT 4: Endpoints de productos (detalle + filtros)** [COMPLETADO]
**Archivo modificado:** `backend/main.py`
**Archivo de prueba:** `backend/test_productos.py`

**Tareas completadas:**
- ✅ Modificar GET `/productos` - Agregar parámetros opcionales `categoria` y `buscar`
  - Parámetro `categoria`: Filtrar por categoría (búsqueda parcial, case-insensitive)
  - Parámetro `buscar`: Buscar en nombre y descripción (búsqueda parcial, case-insensitive)
  - Ambos filtros se pueden combinar
  - Sin parámetros: retorna todos los productos (20 productos)

- ✅ Implementar GET `/productos/{id}` - Retornar producto específico
  - Recibe ID como parámetro de ruta
  - Retorna producto si existe
  - Error 404 con mensaje descriptivo si no existe

**Implementación técnica:**
- Uso de `Optional[str]` para parámetros de query opcionales
- Uso de `.ilike()` de SQLModel para búsquedas case-insensitive
- Uso de operador `|` para OR en búsqueda (nombre OR descripción)
- Uso de `session.get()` para obtener por ID (más eficiente)
- HTTPException con status 404 para producto no encontrado

**Limpieza de proyecto:**
- ❌ Eliminado `test_auth.py` (prueba temporal de desarrollo)
- ❌ Eliminado `verificar_modelos.py` (prueba temporal de desarrollo)
- ✅ Mantenido `test_auth_endpoints.py` (pruebas finales de autenticación)
- ✅ Mantenido `test_productos.py` (pruebas finales de productos)

**Validación:** ✅ Endpoints implementados según `api-tests.http` secciones 2.1 a 2.6

---

### **✅ COMMIT 5: Endpoints de carrito (agregar, quitar, ver, cancelar)** [COMPLETADO]
**Archivo modificado:** `backend/main.py`
**Archivo de prueba:** `backend/test_carrito.py`

**Modelos Pydantic creados:**
- ✅ `AgregarCarritoRequest` - Para agregar producto (producto_id, cantidad)
- ✅ `ItemCarritoResponse` - Para item en respuesta (producto_id, nombre, precio, cantidad, subtotal)
- ✅ `CarritoResponse` - Para respuesta de carrito (items[], total)

**Tareas completadas:**
- ✅ Implementar GET `/carrito` - Ver carrito del usuario autenticado
  - Retorna lista de items con producto, cantidad y subtotal
  - Calcula y retorna total del carrito
  - Retorna carrito vacío si no existe (items=[], total=0)
  - Requiere autenticación (Bearer token)

- ✅ Implementar POST `/carrito` - Agregar producto al carrito
  - Valida que el producto exista (404 si no existe)
  - Valida que haya stock suficiente (400 si no hay)
  - Si el producto ya está, suma la cantidad
  - Si no existe carrito activo, lo crea automáticamente
  - Retorna status 201 Created
  - Requiere autenticación

- ✅ Implementar DELETE `/carrito/{producto_id}` - Quitar producto
  - Elimina completamente el item del carrito
  - Error 404 si el producto no está en el carrito
  - Error 404 si no hay carrito activo
  - Requiere autenticación

- ✅ Implementar POST `/carrito/cancelar` - Cancelar/vaciar carrito
  - Cambia estado del carrito a "cancelado"
  - Items se eliminan automáticamente por CASCADE (modelo)
  - Error 404 si no hay carrito activo
  - Requiere autenticación

**Validaciones implementadas:**
- ✅ Stock suficiente al agregar (compara con existencia del producto)
- ✅ Stock suficiente al sumar cantidad (valida cantidad total)
- ✅ Producto existe antes de agregar
- ✅ Usuario autenticado en todos los endpoints
- ✅ Carrito activo del usuario correcto
- ✅ Producto está en el carrito antes de eliminar

**Lógica de negocio:**
- Al registrar usuario → se crea carrito activo automáticamente
- Al agregar producto existente → suma cantidad (no duplica item)
- Al cancelar → estado "cancelado", items borrados por CASCADE
- Carrito por usuario → filtrado por usuario_id y estado="activo"

**Validación:** ✅ Endpoints implementados según `api-tests.http` sección 4 (4.1 a 4.6)

---

### ✅ **COMMIT 6: Endpoint de finalizar compra con lógica de negocio** - COMPLETADO
**Archivo:** `backend/main.py`
**Tareas:**
- ✅ POST `/carrito/finalizar` - Recibir dirección y tarjeta
- ✅ Calcular IVA: 21% general, 10% para "Electrónica"
- ✅ Calcular envío: Gratis si total >$1000, sino $50
- ✅ Crear registro de Compra con items (ItemCompra)
- ✅ Actualizar stock de productos (disminuir existencia)
- ✅ Cambiar carrito estado a "finalizado"
- ✅ Validación de carrito vacío
- ✅ Validación de stock insuficiente

**Archivos creados:**
- `backend/test_finalizar_compra.py` - Tests de validación
- `backend/debug_finalizar.py` - Script de depuración

**Validación:** ✅ Probado con test_finalizar_compra.py (8 casos de prueba)

---

### **COMMIT 8: Endpoints de historial de compras**
**Archivo:** `backend/main.py`
**Tareas:**
- GET `/compras` - Listar compras del usuario (resumen)
- GET `/compras/{id}` - Detalle completo de una compra
- Validar que la compra pertenezca al usuario autenticado

**Validación:** Probar visualización de historial en `api-tests.http`

---

### **COMMIT 9: Tests unitarios con pytest**
**Archivos:** `backend/test_main.py`, `backend/pytest.ini`
**Tareas:**
- Configurar pytest con base de datos de prueba
- Test de registro de usuario
- Test de login exitoso/fallido
- Test de agregar productos al carrito
- Test de cálculo de IVA (21% y 10%)
- Test de cálculo de envío (gratis y $50)
- Test de finalizar compra
- Test de validación de existencias

**Validación:** Ejecutar `pytest` y verificar que todos pasen

---

### **COMMIT 10: Frontend - Pantalla de registro y login**
**Archivos:** `frontend/app/login/page.tsx`, `frontend/app/registro/page.tsx`
**Tareas:**
- Crear formulario de registro (nombre, email, contraseña)
- Crear formulario de login (email, contraseña)
- Guardar JWT en localStorage
- Redirigir a productos después de login
- Manejar errores de autenticación

**Validación:** Probar flujo de registro → login → productos

---

### **COMMIT 11: Frontend - Componente de carrito y búsqueda**
**Archivos:** `frontend/app/components/Carrito.tsx`, `frontend/app/components/Buscador.tsx`
**Tareas:**
- Agregar barra de búsqueda en productos
- Agregar filtro por categoría
- Agregar botón "Agregar al carrito" en ProductoCard
- Mostrar carrito flotante con productos
- Botón de eliminar producto del carrito
- Mostrar total del carrito

**Validación:** Probar agregar/quitar productos y búsqueda

---

### **COMMIT 12: Frontend - Pantalla de checkout**
**Archivos:** `frontend/app/checkout/page.tsx`
**Tareas:**
- Formulario de dirección de envío
- Formulario de datos de tarjeta
- Mostrar resumen del carrito
- Mostrar cálculo de IVA y envío
- Botón "Finalizar compra"
- Redirigir a historial después de compra exitosa

**Validación:** Probar flujo completo de checkout según diseño.png

---

### **COMMIT 13: Frontend - Pantalla de historial de compras**
**Archivos:** `frontend/app/compras/page.tsx`, `frontend/app/compras/[id]/page.tsx`
**Tareas:**
- Listar compras anteriores (fecha, total, estado)
- Vista de detalle de compra con productos
- Mostrar dirección de envío y datos de pago

**Validación:** Verificar que coincida con pantalla 6 del diseño.png

---

### **COMMIT 14: Ajustes finales y documentación**
**Archivos:** `README.md`, `api-tests.http`
**Tareas:**
- Completar archivo `api-tests.http` con todas las pruebas
- Actualizar README con instrucciones de instalación
- Verificar que todos los endpoints cumplan especificaciones
- Validar reglas de negocio (IVA, envío, existencias)
- Screenshots de las 4 pantallas principales

**Validación:** Revisar checklist completo del GUIAPROYECTO.md

---

## ✅ Checklist de Cumplimiento ESTRICTO

### Base de Datos:
- [x] Usuario: id, nombre, email, contraseña ✅
- [x] Producto: id, nombre, descripción, precio, categoría, existencia ✅
- [x] Carrito: id, usuario_id, estado, productos ✅
- [x] ItemCarrito: producto_id, cantidad ✅
- [x] Compra: id, usuario_id, fecha, dirección, tarjeta, total, envío ✅
- [x] ItemCompra: producto_id, cantidad, nombre, precio_unitario ✅

### Endpoints (12 total):
- [ ] POST `/registrar` ✅
- [ ] POST `/iniciar-sesion` ✅
- [ ] POST `/cerrar-sesion` ✅
- [ ] GET `/productos` (con filtros) ✅
- [ ] GET `/productos/{id}` ✅
- [ ] POST `/carrito` ✅
- [ ] DELETE `/carrito/{product_id}` ✅
- [ ] GET `/carrito` ✅
- [ ] POST `/carrito/finalizar` ✅
- [ ] POST `/carrito/cancelar` ✅
- [ ] GET `/compras` ✅
- [ ] GET `/compras/{id}` ✅

### Reglas de Negocio:
- [ ] Solo agregar si hay existencia ✅
- [ ] Usuario autenticado para compras ✅
- [ ] IVA 21% general, 10% electrónica ✅
- [ ] Envío gratis >$1000, sino $50 ✅
- [ ] No eliminar de carrito finalizado ✅
- [ ] Vaciar carrito al finalizar ✅
- [ ] Mostrar "Agotado" sin stock ✅

### Pantallas (4):
- [ ] Registro/Login ✅
- [ ] Productos + Carrito ✅
- [ ] Checkout ✅
- [ ] Historial ✅

### Testing:
- [ ] Tests unitarios pytest ✅
- [ ] api-tests.http completo ✅

### Datos:
- [ ] Cargar productos.json inicial ✅
- [ ] Imágenes en /imagenes ✅

---

## 🚀 Comandos Rápidos para Cada Commit

```powershell
# Backend - Verificar servidor
cd "C:\Users\lance\Documents\GitHub\tup25-p4\tp\61312 - Paz Berrondo, Lucas David\tp6\backend"
uv run uvicorn main:app --reload

# Frontend - Verificar servidor
cd "C:\Users\lance\Documents\GitHub\tup25-p4\tp\61312 - Paz Berrondo, Lucas David\tp6\frontend"
npm run dev

# Tests
cd backend
uv run pytest

# Git
git add .
git commit -m "feat: descripción del commit"
git push
```

---

## ⚠️ REGLAS ABSOLUTAS

1. **NO TOCAR** archivos fuera de `tp6/`
2. **CUMPLIR EXACTAMENTE** con endpoints del GUIAPROYECTO.md
3. **VALIDAR** cada regla de negocio (IVA, envío, stock)
4. **PROBAR** cada commit con `api-tests.http`
5. **MÍNIMO 10 COMMITS** descriptivos
6. **TESTING** obligatorio con pytest
7. **4 PANTALLAS** según diseño.png

---

## 📊 Estado Actual del Proyecto

| Componente | Estado | Porcentaje |
|------------|--------|------------|
| Modelos DB | ✅ Completo | 100% |
| Autenticación | ❌ Falta | 0% |
| Endpoints API | ⚠️ 1/12 | 8% |
| Lógica Negocio | ❌ Falta | 0% |
| Frontend | ⚠️ Básico | 15% |
| Testing | ❌ Falta | 0% |
| **TOTAL** | **🟡 En Desarrollo** | **20%** |

---

## 📅 Próximos Pasos

1. **Revisar** este plan con el profesor/alumno
2. **Confirmar** que cumple con GUIAPROYECTO.md
3. **Iniciar** COMMIT 1: Modelos de base de datos
4. **Seguir** secuencialmente cada commit
5. **Probar** con api-tests.http después de cada commit backend
6. **Validar** reglas de negocio en cada endpoint

---

**⏰ Fecha de entrega:** Miércoles 12 de Noviembre, 21:00-22:00 hs  
**📦 Total de commits planeados:** 14 (excede el mínimo de 10)
