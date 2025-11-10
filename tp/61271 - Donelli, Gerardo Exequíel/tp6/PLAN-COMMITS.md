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

### **COMMIT 3: Cargar datos iniciales de productos a la BD**
**Archivos a modificar:**
- `backend/main.py` → Función de inicialización que carga productos.json a SQLite

**Reglas a cumplir:**
- Cargar todos los productos de productos.json
- Mantener las imágenes en /imagenes
- No duplicar productos si ya existen

---

### **COMMIT 4: Implementar endpoints de productos con filtros**
**Archivos a modificar:**
- `backend/main.py` → Actualizar endpoints de productos

**Endpoints a modificar/crear:**
- GET /productos → Agregar filtros opcionales (categoría, búsqueda)
- GET /productos/{id} → Nuevo endpoint

**Reglas a cumplir:**
- Filtrado por categoría
- Búsqueda por contenido en nombre/descripción
- Devolver productos desde BD, no desde JSON

---

### **COMMIT 5: Implementar endpoints del carrito (backend)**
**Archivos a modificar:**
- `backend/main.py` → Endpoints del carrito

**Endpoints a crear:**
- POST /carrito → Requiere autenticación
- DELETE /carrito/{product_id} → Requiere autenticación
- GET /carrito → Requiere autenticación
- POST /carrito/cancelar → Requiere autenticación

**Reglas a cumplir:**
- Solo agregar si hay existencia disponible
- Usuario debe estar autenticado
- Validar que el carrito no esté finalizado antes de eliminar productos

---

### **COMMIT 6: Implementar endpoint de finalizar compra**
**Archivos a modificar:**
- `backend/main.py` → Endpoint finalizar compra

**Endpoint a crear:**
- POST /carrito/finalizar → Requiere autenticación

**Reglas a cumplir:**
- Calcular IVA: 21% general, 10% electrónicos (categoría "Electrónica" o similar)
- Calcular envío: gratis si total > $1000, sino $50
- Crear registro de Compra con todos los detalles
- Vaciar carrito después de compra
- Reducir existencias de productos

---

### **COMMIT 7: Implementar endpoints de historial de compras**
**Archivos a modificar:**
- `backend/main.py` → Endpoints de compras

**Endpoints a crear:**
- GET /compras → Requiere autenticación
- GET /compras/{id} → Requiere autenticación

**Reglas a cumplir:**
- Solo devolver compras del usuario autenticado
- Incluir todos los items de cada compra

---

### **COMMIT 8: Implementar pruebas unitarias del backend**
**Archivos a crear/modificar:**
- `backend/test_main.py` (nuevo) → Pruebas para todos los endpoints
- `backend/pytest.ini` → Ya existe, verificar configuración

**Reglas a cumplir:**
- Probar todos los endpoints principales
- Probar casos de error (producto agotado, usuario no encontrado, etc.)
- Usar pytest y httpx

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
