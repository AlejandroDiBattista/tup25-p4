# Plan de Commits para TP6 - E-Commerce

**Objetivo:** Completar el desarrollo del e-commerce cumpliendo ESTRICTAMENTE con las reglas de GUIAPROYECTO.MD  
**Mínimo de commits:** 10  
**Fecha límite:** Miércoles 12 de Noviembre 21:00-22:00 hs

---

## ANÁLISIS DEL ESTADO ACTUAL

### ✅ Lo que YA está implementado:
- Backend básico con FastAPI que sirve productos desde JSON
- Frontend básico con Next.js que muestra productos
- Configuración de CORS
- Servicio de imágenes estáticas
- Modelo Producto definido (parcialmente)

### ❌ Lo que FALTA implementar (según GUIAPROYECTO.MD):

#### Backend:
1. **Modelos de base de datos** (SQLModel + SQLite):
   - Usuario (id, nombre, email, contraseña hashed)
   - Producto (completo con todos los campos)
   - Carrito (id, usuario_id, estado, productos)
   - ItemCarrito (producto_id, cantidad)
   - Compra (id, usuario_id, fecha, direccion, tarjeta, total, envio)
   - ItemCompra (producto_id, cantidad, nombre, precio_unitario)

2. **Endpoints de autenticación**:
   - POST /registrar
   - POST /iniciar-sesion (con token)
   - POST /cerrar-sesion

3. **Endpoints de productos**:
   - GET /productos (con filtros por categoría y búsqueda)
   - GET /productos/{id}

4. **Endpoints de carrito**:
   - POST /carrito (agregar producto)
   - DELETE /carrito/{product_id}
   - GET /carrito
   - POST /carrito/finalizar
   - POST /carrito/cancelar

5. **Endpoints de compras**:
   - GET /compras
   - GET /compras/{id}

6. **Lógica de negocio**:
   - Verificación de existencias
   - Cálculo de IVA (21% general, 10% electrónicos)
   - Cálculo de envío ($50 o gratis si >$1000)
   - Hash de contraseñas
   - Autenticación con tokens
   - Manejo de errores

7. **Pruebas unitarias** (pytest)

8. **Carga inicial de datos** desde productos.json a la BD

#### Frontend:
1. **Pantallas**:
   - Registro e inicio de sesión
   - Listado de productos con búsqueda y filtros
   - Carrito de compras (visible en todas las pantallas)
   - Finalización de compra (dirección y pago)
   - Historial de compras (resumen y detalle)

2. **Funcionalidades**:
   - Autenticación (almacenar token)
   - Búsqueda y filtros de productos
   - Agregar/quitar productos del carrito
   - Mostrar "Agotado" en productos sin existencia
   - Validaciones de formularios
   - Manejo de estados (autenticado/no autenticado)

3. **UI con Tailwind CSS y Shadcn UI**

---

## PLAN DE COMMITS (Mínimo 10)

### **✅ COMMIT 1: Configurar base de datos y modelos completos - COMPLETADO**
**Archivos modificados:**
- ✅ `backend/models/productos.py` → Agregados todos los modelos (Usuario, Producto, Carrito, ItemCarrito, Compra, ItemCompra)
- ✅ `backend/models/__init__.py` → Exportados todos los modelos
- ✅ `backend/main.py` → Inicializada BD SQLite y creación de tablas
- ✅ `.gitignore` → Agregado ecommerce.db y *.db

**Reglas cumplidas:**
- ✅ Estructura de BD exacta según GUIAPROYECTO.MD
- ✅ Usuario con campo contraseña (se hasheará en commit 2)
- ✅ Relaciones entre modelos correctas con Relationship
- ✅ Todas las tablas creadas exitosamente en ecommerce.db

**Verificación:**
- ✅ Servidor arranca sin errores
- ✅ Tablas creadas: usuario, producto, carrito, itemcarrito, compra, itemcompra
- ✅ Índice único en email de usuario
- ✅ Claves foráneas configuradas correctamente

---

### **✅ COMMIT 2: Implementar sistema de autenticación (backend) - COMPLETADO**
**Archivos modificados/creados:**
- ✅ `backend/auth.py` (nuevo) → Funciones de hash de contraseñas y manejo de JWT
- ✅ `backend/main.py` → Endpoints de autenticación y dependencia de usuario actual
- ✅ `backend/pyproject.toml` → Agregadas dependencias: passlib, python-jose, python-multipart, email-validator
- ✅ `backend/models/productos.py` → Cambiado campo `contraseña` a `password` (compatibilidad SQLite)
- ✅ `backend/api-tests.http` → Agregadas pruebas de autenticación
- ✅ `backend/test_auth.py` (nuevo) → Script de pruebas de autenticación

**Endpoints implementados:**
- ✅ POST /registrar → Registra nuevo usuario, retorna token JWT
- ✅ POST /iniciar-sesion → Autentica usuario, retorna token JWT
- ✅ POST /cerrar-sesion → Cierra sesión (requiere autenticación)

**Reglas cumplidas:**
- ✅ Hash de contraseñas con bcrypt mediante passlib
- ✅ Tokens JWT para autenticación con python-jose
- ✅ Validación de email único en base de datos
- ✅ Middleware de seguridad HTTP Bearer implementado
- ✅ Dependencia `obtener_usuario_actual` para proteger endpoints

**Verificación:**
- ✅ Dependencias instaladas correctamente
- ✅ Modelos actualizados sin caracteres especiales en nombres de columnas
- ✅ Sistema de tokens JWT funcionando
- ✅ Validación de emails con email-validator

---

### **✅ COMMIT 3: Cargar datos iniciales de productos a la BD - COMPLETADO**
**Archivos modificados:**
- ✅ `backend/main.py` → Función `cargar_productos_iniciales()` implementada
- ✅ `backend/main.py` → Evento de startup actualizado
- ✅ `backend/main.py` → Endpoint GET /productos actualizado para leer desde BD

**Implementación:**
- ✅ Función que carga productos desde `productos.json` a la BD
- ✅ Validación para no duplicar productos (verifica si ya existen)
- ✅ Carga automática al iniciar el servidor (evento startup)
- ✅ 20 productos cargados exitosamente

**Reglas cumplidas:**
- ✅ Cargar todos los productos de productos.json (20 productos)
- ✅ Mantener las imágenes en /imagenes
- ✅ No duplicar productos si ya existen (verificación en cada inicio)
- ✅ Endpoint /productos ahora obtiene datos desde BD, no desde JSON

**Verificación:**
- ✅ 20 productos cargados en la primera ejecución
- ✅ Mensaje de confirmación en logs
- ✅ No duplicación al reiniciar servidor
- ✅ Endpoint GET /productos retorna status 200
- ✅ Todos los campos correctos (id, titulo, precio, categoria, existencia, etc.)

---

### **✅ COMMIT 4: Implementar endpoints de productos con filtros - COMPLETADO**
**Archivos modificados:**
- ✅ `backend/main.py` → Endpoints de productos actualizados
- ✅ `backend/pyproject.toml` → Agregada dependencia `requests` para testing

**Endpoints implementados:**
- ✅ GET /productos?categoria=X&buscar=Y → Filtros opcionales funcionando
- ✅ GET /productos/{id} → Detalle de producto específico con manejo de 404

**Implementación:**
- ✅ Filtrado por categoría exacta con SQLModel where()
- ✅ Búsqueda case-insensitive en título y descripción usando ilike()
- ✅ Combinación de ambos filtros (categoría + búsqueda)
- ✅ Manejo de errores 404 para productos inexistentes
- ✅ Orden correcto de parámetros en función (session primero)

**Reglas cumplidas:**
- ✅ Filtrado por categoría exacta
- ✅ Búsqueda por contenido en título/descripción (case-insensitive)
- ✅ Devolver productos desde BD usando SQLModel queries
- ✅ Endpoint GET /productos/{id} retorna producto o 404

**Verificación:**
- ✅ Test 1: GET /productos → 20 productos
- ✅ Test 2: GET /productos?categoria=Electrónica → 6 productos
- ✅ Test 3: GET /productos?buscar=mochila → 1 producto
- ✅ Test 4: GET /productos?categoria=Ropa de hombre&buscar=mochila → 1 producto
- ✅ Test 5: GET /productos/1 → Status 200 con datos completos
- ✅ Test 6: GET /productos/9999 → Status 404 (Not Found)
- ✅ 6/6 tests exitosos

---

### **✅ COMMIT 5: Implementar endpoints del carrito (backend) - COMPLETADO**
**Archivos modificados:**
- ✅ `backend/main.py` → Endpoints del carrito implementados y schemas agregados

**Schemas creados:**
- ✅ `AgregarProductoRequest` → Validación de producto_id y cantidad (ge=1)
- ✅ `CarritoResponse` → Schema para respuesta del carrito

**Endpoints implementados:**
- ✅ POST /carrito → Agregar producto (status 201)
- ✅ GET /carrito → Ver contenido del carrito
- ✅ DELETE /carrito/{product_id} → Quitar producto (status 200)
- ✅ POST /carrito/cancelar → Cancelar/vaciar carrito

**Implementación:**
- ✅ Validación de stock antes de agregar productos
- ✅ Validación de producto existente (404 si no existe)
- ✅ Creación automática de carrito si no existe uno activo
- ✅ Actualización de cantidad si producto ya está en carrito
- ✅ Validación de stock total (cantidad existente + nueva)
- ✅ Cálculo de subtotales y total del carrito
- ✅ Cambio de estado a "cancelado" al vaciar carrito
- ✅ Todos los endpoints requieren autenticación (Depends(obtener_usuario_actual))

**Reglas cumplidas:**
- ✅ Solo agregar si hay existencia disponible
- ✅ Validación: stock insuficiente retorna 400
- ✅ Validación: producto agotado retorna 400
- ✅ Usuario debe estar autenticado (403 sin token)
- ✅ Carrito solo puede tener estado "activo" para modificaciones
- ✅ Al cancelar carrito se eliminan todos los items y cambia estado

**Verificación:**
- ✅ Test 1: POST /carrito → Producto agregado (2 unidades)
- ✅ Test 2: POST /carrito → Segundo producto agregado
- ✅ Test 3: POST /carrito → Cantidad actualizada (3 unidades total)
- ✅ Test 4: GET /carrito → 2 items, total $1024.85
- ✅ Test 5: POST /carrito con cantidad excesiva → 400 (stock insuficiente)
- ✅ Test 6: DELETE /carrito/5 → Producto eliminado
- ✅ Test 7: GET /carrito sin auth → 403 (Forbidden)
- ✅ Test 8: POST /carrito/cancelar → 1 item eliminado
- ✅ Test 9: GET /carrito → Carrito vacío (0 items, $0.00)
- ✅ 9/9 tests exitosos

---

### **COMMIT 6: Implementar endpoint de finalizar compra**
---

### **✅ COMMIT 6: Implementar endpoint de finalizar compra - COMPLETADO**
**Archivos modificados:**
- ✅ `backend/main.py` → Endpoint finalizar compra implementado con schemas

**Schemas creados:**
- ✅ `FinalizarCompraRequest` → Validación de dirección (min 10 chars) y tarjeta (4 dígitos)
- ✅ `CompraResponse` → Respuesta con desglose completo (subtotal, IVA, envío, total, items)

**Endpoint implementado:**
- ✅ POST /carrito/finalizar → Requiere autenticación (status 201)

**Implementación del proceso de compra:**
- ✅ Validación de carrito activo (404 si no existe)
- ✅ Validación de carrito no vacío (400 si está vacío)
- ✅ Validación de stock suficiente para cada producto
- ✅ Cálculo de subtotal por categoría (electrónica vs general)
- ✅ Cálculo de IVA diferenciado: 10% para "Electrónica", 21% para resto
- ✅ Cálculo de envío: $0 si subtotal > $1000, sino $50
- ✅ Cálculo de total final: subtotal + IVA + envío
- ✅ Reducción automática de existencias de productos
- ✅ Creación de registro de Compra con fecha, dirección, tarjeta, total, envío
- ✅ Creación de ItemsCompra (snapshot: nombre, precio_unitario al momento de compra)
- ✅ Eliminación de items del carrito
- ✅ Cambio de estado del carrito a "finalizado"

**Reglas cumplidas:**
- ✅ IVA 21% general, 10% para categoría "Electrónica" exacta
- ✅ Envío gratis si subtotal > $1000, sino costo fijo $50
- ✅ Registro de Compra con todos los campos requeridos
- ✅ ItemsCompra guarda snapshot de productos (nombre, precio al momento de compra)
- ✅ Carrito se vacía completamente después de finalizar
- ✅ Existencias de productos se reducen correctamente
- ✅ Validación de stock antes de finalizar (evita compras sin stock)

**Verificación:**
- ✅ Test 1: Compra > $1000 (Pulsera $1390) → Envío gratis, IVA 21%, Total $1681.90
- ✅ Test 2: Compra < $1000 (Mochila + Camiseta $242.20) → Envío $50, IVA 21%, Total $343.06
- ✅ Test 3: IVA mixto (SSD $109 + Chaquetas $111.98) → IVA $34.42 (10% + 21%), Total $305.40
- ✅ Test 4: Carrito vacío después de compra → 0 items
- ✅ Test 5: Finalizar sin carrito activo → 404 (correcto)
- ✅ 5/5 tests exitosos

**Fórmulas implementadas:**
- IVA Electrónica: `subtotal_electronica * 0.10`
- IVA General: `subtotal_general * 0.21`
- Envío: `0 if subtotal > 1000 else 50`
- Total: `subtotal + iva_total + costo_envio`

---

### **✅ COMMIT 7: Implementar endpoints de historial de compras - COMPLETADO**
**Archivos modificados:**
- ✅ `backend/main.py` → Endpoints de historial implementados

**Endpoints implementados:**
- ✅ GET /compras → Historial de compras del usuario
- ✅ GET /compras/{id} → Detalle completo de una compra

**Implementación del historial:**
- ✅ GET /compras retorna lista de compras ordenadas por fecha descendente
- ✅ Resumen incluye: id, fecha, total, envío, dirección, cantidad de productos
- ✅ Manejo de historial vacío con mensaje apropiado
- ✅ Contador de total de compras realizadas

**Implementación del detalle:**
- ✅ GET /compras/{id} retorna detalle completo con items
- ✅ Validación de compra existente (404 si no existe)
- ✅ Validación de permisos (403 si no pertenece al usuario)
- ✅ Tarjeta mostrada como "****XXXX" (solo últimos 4 dígitos)
- ✅ Desglose financiero completo: subtotal, IVA, envío, total
- ✅ Items con snapshot de datos al momento de compra
- ✅ Cálculo retroactivo de IVA: total - subtotal - envío
- ✅ Imagen del producto actual (puede haber cambiado desde compra)

**Reglas cumplidas:**
- ✅ Solo devolver compras del usuario autenticado
- ✅ Incluir todos los items de cada compra con detalles
- ✅ Protección de privacidad (otros usuarios no pueden ver compras ajenas)
- ✅ Autenticación requerida para ambos endpoints
- ✅ ItemCompra mantiene snapshot (nombre, precio_unitario al momento de compra)

**Verificación:**
- ✅ Test 1: GET /compras → Status 200, 1 compra con datos completos
- ✅ Test 2: GET /compras/4 → Detalle completo (fecha, dirección, tarjeta, desglose, items)
- ✅ Test 3: GET /compras/99999 → 404 (compra inexistente)
- ✅ Test 4: Otro usuario accede a compra → 403 (Forbidden - seguridad)
- ✅ Test 5: GET /compras sin auth → 403 (requiere autenticación)
- ✅ 5/5 tests exitosos

**Seguridad implementada:**
- ✅ Validación de propiedad: `compra.usuario_id == usuario_actual.id`
- ✅ Solo últimos 4 dígitos de tarjeta visibles
- ✅ Autenticación obligatoria vía JWT

---

### **✅ COMMIT 8: Tests unitarios del backend con pytest - COMPLETADO**
**Archivos creados:**
- ✅ `backend/test_main.py` → Suite completa de tests con pytest

**Tests implementados (32 total):**

**Autenticación (6 tests):**
- ✅ test_registrar_usuario → Registro exitoso con token
- ✅ test_registrar_email_duplicado → Prevenir emails duplicados
- ✅ test_iniciar_sesion_exitoso → Login con credenciales correctas
- ✅ test_iniciar_sesion_credenciales_invalidas → Rechazar credenciales incorrectas
- ✅ test_cerrar_sesion_requiere_auth → Logout requiere autenticación
- ✅ test_cerrar_sesion_exitoso → Cerrar sesión correctamente

**Productos (5 tests):**
- ✅ test_obtener_productos → Listar todos los productos
- ✅ test_filtrar_productos_por_categoria → Filtro por categoría
- ✅ test_buscar_productos_por_texto → Búsqueda por texto
- ✅ test_obtener_producto_por_id → Detalle de producto específico
- ✅ test_obtener_producto_no_existente → Error 404 para producto inexistente

**Carrito (8 tests):**
- ✅ test_agregar_al_carrito_requiere_auth → Requiere autenticación
- ✅ test_agregar_producto_al_carrito → Agregar producto exitosamente
- ✅ test_agregar_producto_agotado → No permitir productos sin stock
- ✅ test_agregar_cantidad_excede_stock → Validar stock disponible
- ✅ test_ver_carrito_vacio → Ver carrito sin items
- ✅ test_ver_carrito_con_productos → Ver carrito con items
- ✅ test_eliminar_producto_carrito → Eliminar producto del carrito
- ✅ test_cancelar_carrito → Cancelar carrito completo

**Compra (5 tests):**
- ✅ test_finalizar_compra_carrito_vacio → Error al finalizar sin items
- ✅ test_finalizar_compra_exitosa → Finalización exitosa
- ✅ test_calculo_iva_electronica → IVA 10% para electrónica
- ✅ test_calculo_envio_gratis → Envío gratis si subtotal > $1000
- ✅ test_compra_reduce_stock → Verificar reducción de existencias

**Historial (5 tests):**
- ✅ test_ver_historial_vacio → Historial sin compras
- ✅ test_ver_historial_con_compras → Listar compras realizadas
- ✅ test_ver_detalle_compra → Detalle completo de compra
- ✅ test_detalle_compra_no_existente → Error 404 para compra inexistente
- ✅ test_detalle_compra_otro_usuario → Seguridad entre usuarios (403)

**Casos de error (3 tests):**
- ✅ test_endpoint_sin_autenticacion → Validar auth en endpoints protegidos
- ✅ test_producto_no_existente_carrito → Error al agregar producto inexistente
- ✅ test_cantidad_negativa_carrito → Validación de cantidad mínima

**Implementación técnica:**
- ✅ Uso de fixtures con base de datos en memoria (SQLite :memory:)
- ✅ Aislamiento completo entre tests
- ✅ TestClient de FastAPI con dependency override
- ✅ Helpers para crear usuarios y headers de autenticación
- ✅ Productos de prueba con diferentes categorías y stock

**Verificación:**
```bash
uv run pytest test_main.py -v
# Resultado: 32 passed, 27 warnings in 8.11s ✅
```

**Cobertura de endpoints:**
- ✅ POST /registrar, /iniciar-sesion, /cerrar-sesion
- ✅ GET /productos, /productos/{id}
- ✅ POST /carrito, GET /carrito, DELETE /carrito/{id}, POST /carrito/cancelar
- ✅ POST /carrito/finalizar
- ✅ GET /compras, /compras/{id}

**Reglas cumplidas:**
- ✅ Todos los endpoints principales probados
- ✅ Casos de error cubiertos (404, 400, 403, 422)
- ✅ Validaciones de negocio testeadas (stock, IVA, envío)
- ✅ Seguridad verificada (auth, ownership)
- ✅ 100% de tests pasando

---

### **COMMIT 9: Implementar autenticación y registro en frontend**
**Archivos a crear/modificar:**
- `frontend/app/auth/login/page.tsx` (nuevo) → Pantalla de login
- `frontend/app/auth/register/page.tsx` (nuevo) → Pantalla de registro
- `frontend/app/services/auth.ts` (nuevo) → Servicios de autenticación
- `frontend/app/layout.tsx` → Header con botones login/logout
- `frontend/app/context/AuthContext.tsx` (nuevo) → Context para estado de autenticación

**Reglas a cumplir:**
- Almacenar token en localStorage o cookies
- Mostrar estado de usuario (autenticado/no autenticado)
- Redireccionar después de login exitoso

---

### **COMMIT 10: Implementar carrito de compras en frontend**
**Archivos a crear/modificar:**
- `frontend/app/components/Carrito.tsx` (nuevo) → Componente del carrito
- `frontend/app/services/carrito.ts` (nuevo) → Servicios del carrito
- `frontend/app/layout.tsx` → Integrar carrito visible
- `frontend/app/page.tsx` → Botones para agregar al carrito
- `frontend/app/components/ProductoCard.tsx` → Agregar botón "Agregar al carrito"

**Reglas a cumplir:**
- Mostrar "Agotado" en productos sin existencia
- No permitir agregar productos agotados
- Mostrar total del carrito
- Actualizar carrito en tiempo real

---

### **COMMIT 11: Implementar búsqueda y filtros de productos**
**Archivos a modificar:**
- `frontend/app/page.tsx` → Agregar barra de búsqueda y filtros
- `frontend/app/components/FiltrosProductos.tsx` (nuevo) → Componente de filtros
- `frontend/app/services/productos.ts` → Agregar parámetros de búsqueda

**Reglas a cumplir:**
- Filtro por categoría
- Búsqueda por contenido
- Actualizar productos dinámicamente

---

### **COMMIT 12: Implementar pantalla de finalizar compra**
**Archivos a crear:**
- `frontend/app/checkout/page.tsx` (nuevo) → Pantalla de finalización
- `frontend/app/components/FormularioCompra.tsx` (nuevo) → Formulario de dirección y pago

**Reglas a cumplir:**
- Mostrar resumen del carrito
- Formulario de dirección de envío
- Formulario de datos de tarjeta
- Mostrar cálculo de IVA y envío
- Botón para finalizar compra

---

### **COMMIT 13: Implementar historial de compras en frontend**
**Archivos a crear:**
- `frontend/app/compras/page.tsx` (nuevo) → Lista de compras
- `frontend/app/compras/[id]/page.tsx` (nuevo) → Detalle de compra
- `frontend/app/services/compras.ts` (nuevo) → Servicios de compras

**Reglas a cumplir:**
- Mostrar resumen de todas las compras
- Ver detalle completo de cada compra
- Requiere autenticación

---

### **COMMIT 14: Implementar UI con Shadcn UI y pulir estilos**
**Archivos a modificar:**
- Todos los componentes → Aplicar componentes de Shadcn UI
- `frontend/app/globals.css` → Ajustar estilos globales

**Reglas a cumplir:**
- Usar Shadcn UI para componentes (botones, cards, forms, etc.)
- Mantener diseño responsivo
- Aspecto profesional según pantallas de referencia

---

### **COMMIT 15: Manejo de errores y validaciones finales**
**Archivos a modificar:**
- Backend y Frontend → Agregar manejo de errores completo
- Frontend → Agregar mensajes de error/éxito (toast/alerts)

**Reglas a cumplir:**
- Manejo de errores HTTP
- Validaciones de formularios
- Mensajes claros al usuario
- Casos edge: producto no encontrado, carrito vacío, etc.

---

## RESUMEN DE CUMPLIMIENTO DE REGLAS

✅ **Funcionalidad completa:**
- Registrar usuario
- Iniciar/cerrar sesión
- Ver resumen y detalle de compras
- Buscar productos (contenido y categoría)
- Agregar/quitar del carrito
- Cancelar/finalizar compra

✅ **Tecnologías correctas:**
- Frontend: Next.js + React 19 + Tailwind CSS + Shadcn UI
- Backend: FastAPI + SQLModel + SQLite

✅ **Reglas de negocio:**
- Solo agregar si hay existencia
- Autenticación requerida para compras
- IVA 21% general, 10% electrónicos
- Envío gratis >$1000, sino $50
- Productos agotados no se pueden agregar
- Carrito se vacía al finalizar compra

✅ **Pruebas unitarias**

✅ **Datos iniciales desde productos.json**

✅ **Mínimo 10 commits** (planificados 15 para mayor detalle)

---

## NOTAS IMPORTANTES

1. **NO tocar archivos fuera de:** `C:\Users\54381\OneDrive\Escritorio\tup25-p4\tp\61271 - Donelli, Gerardo Exequíel\tp6`

2. **Cada commit debe:**
   - Tener un mensaje descriptivo
   - Incluir solo los cambios relacionados con ese commit
   - Ser funcional (no romper el código existente)

3. **Orden de implementación:**
   - Primero backend completo (commits 1-8)
   - Luego frontend completo (commits 9-15)
   - Esto permite probar el backend antes de integrarlo

4. **Testing:**
   - Probar cada endpoint con api-tests.http o pytest
   - Verificar que el frontend se conecta correctamente al backend

---

## PRÓXIMOS PASOS

1. Revisar este plan y confirmar que cumple con todos los requisitos
2. Comenzar con el COMMIT 1
3. Ejecutar y probar cada commit antes de pasar al siguiente
4. Hacer git commit después de cada fase completada
5. Verificar funcionamiento completo al finalizar

¿Comenzamos con el COMMIT 1?
