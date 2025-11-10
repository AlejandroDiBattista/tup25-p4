# Guía de Pruebas - E-Commerce TP6

Este documento describe los pasos para probar manualmente todas las funcionalidades del sistema.

## Pre-requisitos

1. **Backend ejecutándose:**
   ```powershell
   cd backend
   uv run uvicorn main:app --reload
   ```
   - URL: http://localhost:8000
   - Docs: http://localhost:8000/docs

2. **Frontend ejecutándose:**
   ```powershell
   cd frontend
   npm run dev
   ```
   - URL: http://localhost:3000

## Flujo de Pruebas Completo

### 1. Registro de Usuario

**Objetivo:** Crear una cuenta nueva

**Pasos:**
1. Abrir http://localhost:3000
2. Serás redirigido a `/auth/login` (porque no estás autenticado)
3. Hacer clic en "Regístrate aquí"
4. Completar el formulario:
   - Nombre: `Juan Pérez`
   - Email: `juan.perez@test.com`
   - Contraseña: `test1234` (mínimo 6 caracteres)
5. Hacer clic en "Registrarse"

**Resultado esperado:**
- ✅ Aparece un toast verde: "¡Cuenta creada! Tu cuenta ha sido creada exitosamente"
- ✅ Eres redirigido automáticamente a la página principal (`/`)
- ✅ Ves el catálogo de productos
- ✅ El Header muestra tu nombre: "Hola, Juan"
- ✅ Hay un botón "Cerrar sesión" visible

**Resultado incorrecto (bug):**
- ❌ Si te quedas en la página de registro
- ❌ Si aparece un error
- ❌ Si te manda a otra página que no es `/`

---

### 2. Cerrar Sesión y Login

**Objetivo:** Verificar que puedes cerrar sesión y volver a iniciar

**Pasos:**
1. Hacer clic en "Cerrar sesión" en el Header
2. Confirmar que fuiste redirigido a `/auth/login`
3. Completar el formulario de login:
   - Email: `juan.perez@test.com`
   - Contraseña: `test1234`
4. Hacer clic en "Iniciar sesión"

**Resultado esperado:**
- ✅ Aparece un toast verde: "¡Bienvenido! Has iniciado sesión correctamente"
- ✅ Eres redirigido a la página principal (`/`)
- ✅ Ves el catálogo de productos
- ✅ El Header muestra tu nombre nuevamente

---

### 3. Navegación y Filtros

**Objetivo:** Probar los filtros de productos

**Pasos:**
1. En la página principal, observar cuántos productos hay (ej: "20 productos disponibles")
2. **Probar búsqueda:**
   - Escribir "laptop" en el campo "Buscar productos"
   - Observar que se filtran solo productos que coinciden
3. **Probar filtro por categoría:**
   - Seleccionar una categoría del dropdown (ej: "Electronics")
   - Observar que se filtran productos de esa categoría
4. Hacer clic en "Limpiar filtros"
5. Verificar que vuelven a aparecer todos los productos

**Resultado esperado:**
- ✅ Los filtros funcionan correctamente
- ✅ El contador se actualiza con el número de productos filtrados
- ✅ "Limpiar filtros" restaura la vista completa

---

### 4. Agregar Productos al Carrito

**Objetivo:** Agregar múltiples productos al carrito

**Pasos:**
1. Hacer clic en "Agregar al carrito" en 3 productos diferentes
2. Observar los toasts que aparecen

**Resultado esperado:**
- ✅ Por cada producto agregado aparece un toast verde: "Producto agregado - El producto se agregó al carrito correctamente"
- ✅ Los productos se agregan sin errores

---

### 5. Ver y Gestionar el Carrito

**Objetivo:** Revisar el carrito, eliminar productos y vaciar carrito

**Pasos:**
1. Hacer clic en "Ver Carrito" (botón superior derecha)
2. **Verificar el modal del carrito:**
   - Título: "Carrito de Compras"
   - Lista de productos agregados con:
     - Imagen del producto
     - Nombre y precio unitario
     - Cantidad
     - Subtotal
     - Botón "Eliminar"
   - Total calculado correctamente
   - Botones: "Vaciar carrito" y "Finalizar compra"
3. **Probar eliminar un producto:**
   - Hacer clic en "Eliminar" en uno de los productos
   - Observar el toast de confirmación
4. **Probar vaciar carrito:**
   - Hacer clic en "Vaciar carrito"
   - Confirmar en el diálogo
   - Observar que el carrito queda vacío
5. Cerrar el modal haciendo clic en la X o fuera del modal
6. Agregar nuevamente 2-3 productos al carrito

**Resultado esperado:**
- ✅ El modal se abre y muestra correctamente los productos
- ✅ Eliminar un producto funciona y actualiza el total
- ✅ Vaciar carrito elimina todos los productos
- ✅ El modal se puede cerrar correctamente
- ✅ No hay problemas de navegación (no te quedas "atrapado")

---

### 6. Finalizar Compra

**Objetivo:** Completar una compra exitosamente

**Pasos:**
1. Con productos en el carrito, hacer clic en "Ver Carrito"
2. Hacer clic en "Finalizar compra"
3. **Verificar el formulario de checkout:**
   - Título cambia a "Finalizar Compra"
   - Resumen del pedido visible con productos y total
   - Campos del formulario:
     - Dirección de envío (mínimo 10 caracteres)
     - Últimos 4 dígitos de la tarjeta (exactamente 4 dígitos numéricos)
4. Completar el formulario:
   - Dirección: `Calle Falsa 123, Springfield, CP 12345`
   - Tarjeta: `1234`
5. Hacer clic en "Confirmar Compra"

**Resultado esperado:**
- ✅ Aparece un toast verde: "¡Compra realizada! Total pagado: $XXX.XX"
- ✅ El modal del carrito se cierra automáticamente
- ✅ Después de ~0.5 segundos, eres redirigido a `/compras`
- ✅ La página de "Mis Compras" se carga correctamente

**Resultado incorrecto (bug anterior):**
- ❌ Si el modal se queda abierto después de la compra
- ❌ Si no puedes navegar a otras páginas
- ❌ Si te quedas "atrapado" en alguna vista

---

### 7. Ver Historial de Compras

**Objetivo:** Verificar que las compras se guardan correctamente

**Pasos:**
1. En la página "Mis Compras" (`/compras`):
   - Verificar el botón "Volver a productos" arriba a la izquierda
   - Verificar el Header con navegación (enlace a "Productos" y "Mis Compras")
2. Observar la tarjeta de tu compra reciente:
   - Número de compra
   - Fecha y hora
   - Total
   - Badge de envío
   - Dirección
   - Cantidad de productos
3. Hacer clic en la tarjeta de compra

**Resultado esperado:**
- ✅ El botón "Volver a productos" funciona
- ✅ El Header permite navegar a diferentes secciones
- ✅ La compra aparece en el historial con todos los datos correctos
- ✅ Al hacer clic en la tarjeta, vas a `/compras/[id]` (detalle de compra)

---

### 8. Ver Detalle de Compra

**Objetivo:** Ver información completa de una compra

**Pasos:**
1. En la página de detalle de compra:
   - Verificar el botón "Volver al historial"
   - Ver información de la compra:
     - Número de compra
     - Fecha y hora
     - Total
     - Dirección de envío
     - Últimos 4 dígitos de tarjeta
   - Ver lista de productos comprados con:
     - Imagen
     - Nombre
     - Cantidad
     - Precio unitario
     - Subtotal
2. Hacer clic en "Volver al historial"

**Resultado esperado:**
- ✅ Toda la información se muestra correctamente
- ✅ El botón "Volver al historial" te lleva a `/compras`
- ✅ La navegación es fluida

---

### 9. Navegación General

**Objetivo:** Verificar que puedes moverte libremente por la aplicación

**Pasos:**
1. Desde cualquier página, usar los enlaces del Header:
   - Hacer clic en "E-Commerce" (logo) → debe ir a `/`
   - Hacer clic en "Productos" → debe ir a `/`
   - Hacer clic en "Mis Compras" → debe ir a `/compras`
2. Usar los botones "Volver" de cada página
3. Cerrar sesión y verificar que vuelves a `/auth/login`

**Resultado esperado:**
- ✅ Todos los enlaces funcionan correctamente
- ✅ No hay páginas donde te quedes "atrapado"
- ✅ La navegación es intuitiva y fluida
- ✅ Al cerrar sesión, se limpia la sesión correctamente

---

### 10. Validaciones y Errores

**Objetivo:** Probar que las validaciones funcionan

**Pasos:**
1. **Registro con contraseña corta:**
   - Intentar registrarse con contraseña de 3 caracteres
   - Verificar toast de error
2. **Login con credenciales incorrectas:**
   - Intentar login con email/contraseña incorrectos
   - Verificar toast de error
3. **Compra con datos inválidos:**
   - Intentar finalizar compra con dirección de 5 caracteres
   - Intentar con tarjeta de 3 dígitos
   - Verificar validación del formulario

**Resultado esperado:**
- ✅ Todos los errores se muestran con toasts claros
- ✅ Las validaciones de formularios funcionan
- ✅ No se envían datos inválidos al backend

---

## Checklist de Funcionalidades

- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Filtros de productos (búsqueda y categoría) funcionan
- [ ] Agregar productos al carrito funciona
- [ ] Ver carrito funciona
- [ ] Eliminar producto del carrito funciona
- [ ] Vaciar carrito funciona
- [ ] Finalizar compra funciona
- [ ] Navegación a historial después de compra funciona (sin quedar atrapado)
- [ ] Ver historial de compras funciona
- [ ] Ver detalle de compra funciona
- [ ] Navegación general (Header, botones volver) funciona
- [ ] Toast notifications se muestran correctamente
- [ ] Validaciones de formularios funcionan
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en el backend

---

## Problemas Conocidos Resueltos

### ✅ Problema: "Después de registrarme no puedo salir"
**Solución implementada:**
- Refactorizado el componente Carrito para usar Dialog de Shadcn UI
- Agregado delay antes de navegación para permitir que el modal se cierre
- Agregado botón "Volver a productos" en página de compras
- Header siempre visible con enlaces de navegación

### ✅ Problema: "El modal del carrito se queda abierto"
**Solución implementada:**
- Cierre explícito del Dialog antes de navegar
- Uso correcto de `onOpenChange` prop
- Navegación programática con `router.push()` después del cierre

---

## Pruebas de Integración Backend

Si quieres probar el backend directamente:

```powershell
cd backend
uv run pytest -v
```

Deberías ver:
```
test_auth.py::test_registrar_usuario PASSED
test_auth.py::test_login_usuario PASSED
test_auth.py::test_login_credenciales_invalidas PASSED
...
test_main.py::test_agregar_al_carrito PASSED
test_main.py::test_obtener_carrito PASSED
test_main.py::test_finalizar_compra PASSED
...
```

---

## Notas Adicionales

- **Persistencia:** Los datos se guardan en `backend/tienda.db` (SQLite)
- **Tokens:** Se guardan en localStorage del navegador
- **Sesión:** Se mantiene al recargar la página
- **Limpieza:** Para empezar de cero, eliminar `backend/tienda.db` y reiniciar el backend

---

**Fecha de creación:** 10 de noviembre de 2025  
**Última actualización:** 10 de noviembre de 2025  
**Versión:** 1.0
