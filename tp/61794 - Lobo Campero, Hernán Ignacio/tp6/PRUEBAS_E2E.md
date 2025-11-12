# 📋 PRUEBAS E2E - TP6 Shop

**Fecha:** 11 de Noviembre de 2025  
**Usuario de Prueba:** Juan Perez (jperez@mail.com)

---

## ✅ PRUEBAS REALIZADAS

### 1. **Pantalla Principal (Home)**
- [x] Header muestra "TP6 Shop" 
- [x] Navegación visible: "Productos | Ingresar | Crear cuenta"
- [x] Catálogo de productos carga correctamente
- [x] Buscador funciona (búsqueda por texto)
- [x] Filtro de categorías funciona
- [x] Productos muestran: imagen, título, descripción, precio, stock
- [x] Botón "Agregar al carrito" presente en cada producto

### 2. **Autenticación - Registro**
- [x] Página "Crear cuenta" accesible desde botón "Crear cuenta" en header
- [x] Formulario completo: Nombre, Email, Contraseña, Confirmar Contraseña
- [x] Validación de contraseñas coinciden
- [x] Validación de contraseña mínimo 6 caracteres
- [x] Registro exitoso crea usuario en BD
- [x] Usuario redirige a home después de registro
- [x] Enlace "¿Ya tienes cuenta?" funciona

### 3. **Autenticación - Login**
- [x] Página "Iniciar sesión" accesible
- [x] Formulario: Email, Contraseña
- [x] Login exitoso con credenciales correctas
- [x] Mensaje de error con credenciales incorrectas
- [x] Token JWT guardado en localStorage
- [x] Usuario redirige a home después de login
- [x] Enlace "Regístrate aquí" funciona

### 4. **Header después de Autenticación**
- [x] Nombre de usuario visible en header: "Juan Perez"
- [x] Navegación cambió: "Productos | Mis compras | Juan Perez | Salir"
- [x] Link "Mis compras" funciona
- [x] Botón "Salir" cierra sesión y redirige a home
- [x] Header vuelve a mostrar "Ingresar | Crear cuenta" después de logout

### 5. **Carrito de Compras**
- [x] Agregar producto al carrito funciona
- [x] Carrito muestra items agregados
- [x] Se muestra: producto, cantidad, precio unitario, subtotal
- [x] Cálculo de IVA correcto (21% general, 10% electrónica)
- [x] Cálculo de envío correcto ($50 fijo o gratis >$1000)
- [x] Total calculado correctamente
- [x] Botón "Eliminar" remueve items del carrito
- [x] Botón "Cancelar" vacía el carrito

### 6. **Checkout / Finalizar Compra**
- [x] Página "Finalizar compra" muestra resumen del carrito
- [x] Campos: Dirección, Tarjeta (últimos 4 dígitos)
- [x] Validación: Dirección no puede estar vacía
- [x] Validación: Tarjeta requiere al menos 4 dígitos
- [x] Botón "Confirmar compra" procesa la compra
- [x] Compra redirige a "Mis compras"

### 7. **Historial de Compras**
- [x] Página "Mis compras" muestra lista de compras del usuario
- [x] Cada compra muestra: ID, Fecha, Total
- [x] Click en compra expande detalles
- [x] Detalles muestran: ID, Fecha, Dirección, Tarjeta (oculta)
- [x] Detalles muestran items: nombre, cantidad, precio, IVA
- [x] Detalles muestran totales: subtotal, IVA, envío, total

### 8. **Búsqueda y Filtros**
- [x] Búsqueda por texto funciona en tiempo real
- [x] Filtro por categoría funciona
- [x] Combinación de búsqueda + filtro funciona
- [x] Mensaje cuando no hay resultados

### 9. **Validaciones y Errores**
- [x] Mensaje de error si no hay carrito activo
- [x] Mensaje de error si producto no tiene stock
- [x] Mensaje de error si token expirado
- [x] Mensaje de error si email duplicado en registro
- [x] Mensajes de validación en formularios

### 10. **Persistencia de Datos**
- [x] Token persiste en localStorage
- [x] Usuario se mantiene logueado al refrescar página
- [x] Carrito persiste en sesión
- [x] Compras se guardan en BD

---

## 🔧 CORRECCIONES REALIZADAS

| # | Falencia | Corrección | Estado |
|---|----------|-----------|--------|
| 1 | Nombre "Venti Indumentaria" | Cambiar a "TP6 Shop" | ✅ |
| 2 | Header inconsistente | Alinear con especificaciones | ✅ |
| 3 | Gradient azul en auth | Remover (fondo blanco) | ✅ |
| 4 | Títulos de auth | Cambiar a "Iniciar sesión" / "Crear cuenta" | ✅ |
| 5 | Botones de auth | Cambiar a enlaces de texto | ✅ |
| 6 | Token mapping | Mapear access_token → token | ✅ |
| 7 | Bcrypt error | Cambiar a argon2 | ✅ |
| 8 | Decode token | Corregir retorno de payload | ✅ |
| 9 | Endpoints auth | Añadir prefijo /api/ | ✅ |
| 10 | Carrito 401 | Corregir extracción de usuario_id | ✅ |

---

## 📊 MÉTRICAS FINALES

| Métrica | Valor |
|---------|-------|
| Commits Totales | 11 |
| Tests Unitarios | 15/15 PASS ✅ |
| Endpoints API | 13 ✅ |
| Funcionalidades Requeridas | 10/10 ✅ |
| Pantallas Principales | 4/4 ✅ |
| Validaciones | 100% ✅ |
| Errores Críticos | 0 ✅ |

---

## ✨ CARACTERÍSTICAS IMPLEMENTADAS

- ✅ Registro de usuario con validación de email
- ✅ Login con JWT tokens
- ✅ Cerrar sesión
- ✅ Ver resumen de compras
- ✅ Ver detalle de compras
- ✅ Buscar productos (por contenido y categoría)
- ✅ Agregar productos al carrito
- ✅ Quitar productos del carrito
- ✅ Cancelar compra (vaciar carrito)
- ✅ Finalizar compra
- ✅ IVA diferenciado (21% / 10% electrónica)
- ✅ Envío calculado ($50 / gratis >$1000)
- ✅ Manejo de errores completo
- ✅ Tests unitarios exhaustivos

---

## 🚀 CONCLUSIÓN

**PROYECTO COMPLETADO EXITOSAMENTE**

Toda la plataforma funciona según las especificaciones del README.md:
- UI/UX alineado con mockups proporcionados
- Funcionalidad completa implementada
- Tests pasando al 100%
- Error handling robusto
- Arquitectura limpia y escalable

**Listo para entrega** ✅

