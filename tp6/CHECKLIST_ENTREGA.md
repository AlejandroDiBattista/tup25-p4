# ✅ Checklist Pre-Entrega TP6

## Antes de Entregar

### 1. Backend - Instalación y Testing

- [ ] Navegar a `tp6/backend`
- [ ] Crear entorno virtual: `python -m venv venv`
- [ ] Activar: `.\venv\Scripts\activate`
- [ ] Instalar deps: `pip install -r requirements.txt`
- [ ] Ejecutar pruebas: `pytest test_api.py -v`
- [ ] Verificar que todas las pruebas pasan ✅
- [ ] Ejecutar servidor: `python main.py`
- [ ] Verificar en http://localhost:8000/docs
- [ ] Probar endpoints manualmente en Swagger

### 2. Frontend - Instalación y Ejecución

- [ ] En otra terminal, navegar a `tp6/frontend`
- [ ] Instalar deps: `npm install`
- [ ] Ejecutar: `npm run dev`
- [ ] Verificar en http://localhost:3000
- [ ] Verificar que carga la página principal
- [ ] Verificar que se conecta al backend

### 3. Flujo Completo de Usuario

- [ ] Registrar nuevo usuario en `/registro`
- [ ] Iniciar sesión en `/login`
- [ ] Ver lista de productos en inicio
- [ ] Buscar un producto (ej: "laptop")
- [ ] Filtrar por categoría (ej: "Electrónica")
- [ ] Agregar producto al carrito
- [ ] Ir a `/carrito`
- [ ] Verificar totales (subtotal, IVA, envío)
- [ ] Ir a `/checkout`
- [ ] Ingresar dirección y tarjeta (simulada)
- [ ] Finalizar compra
- [ ] Ver mensaje de éxito
- [ ] Ir a `/compras`
- [ ] Ver historial de compras
- [ ] Ver detalle de compra
- [ ] Cerrar sesión desde navbar

### 4. Validaciones Importantes

**Backend:**
- [ ] BD creada (`backend/tienda.db` existe)
- [ ] 10 productos cargados inicialmente
- [ ] Token JWT se genera correctamente
- [ ] IVA calculado correctamente (21% normal, 10% electrónica)
- [ ] Envío calculado correctamente ($50 o gratis >$1000)
- [ ] No se vende más del disponible
- [ ] Contraseña hasheada en BD

**Frontend:**
- [ ] Token guardado en localStorage
- [ ] Sesión persiste al recargar
- [ ] Carrito se actualiza
- [ ] Redirige a login si no autenticado
- [ ] Navbar muestra nombre de usuario
- [ ] Número de carrito se actualiza

### 5. Documentación

- [ ] README.md existe en tp6/
- [ ] INSTALACION.md existe
- [ ] SUMARIO_TECNICO.md existe
- [ ] backend/README.md existe
- [ ] frontend/README.md existe
- [ ] Todos son legibles y claros

### 6. Git y Commits

- [ ] Estar en rama `tp6-61120-GuerreroSofia`
- [ ] Todos los cambios commiteados
- [ ] Mensajes de commit son descriptivos
- [ ] No hay cambios sin commitear

### 7. Código y Estructura

- [ ] No hay errores de sintaxis en archivos principales
- [ ] Estructura de carpetas es correcta
- [ ] Todos los archivos requeridos existen
- [ ] No hay archivos temporales

### 8. Testing Final

**Casos a probar:**
- [ ] Registro con email válido
- [ ] Registro con email duplicado (error)
- [ ] Login correcto
- [ ] Login incorrecto (error)
- [ ] Agregar producto agotado (error)
- [ ] Compra con envío gratis (>$1000)
- [ ] Compra con envío a pagar (<$1000)
- [ ] Ver detalle de compra anterior

### 9. Performance y Limpieza

- [ ] Frontend sin warnings en consola (excepto warnings de Next.js)
- [ ] Backend sin errores de DB
- [ ] No hay console.log() de debug en producción
- [ ] Aplicación responde rápidamente

### 10. Funcionalidades Críticas

**Debe funcionar SÍ o SÍ:**
- [ ] Registro de usuario ✅
- [ ] Login ✅
- [ ] Logout ✅
- [ ] Ver productos ✅
- [ ] Buscar productos ✅
- [ ] Filtrar productos ✅
- [ ] Agregar al carrito ✅
- [ ] Ver carrito ✅
- [ ] Quitar del carrito ✅
- [ ] Finalizar compra ✅
- [ ] Ver historial ✅

---

## Hora Límite de Entrega

📅 **Miércoles 12 de Noviembre**
🕘 **Desde las 21:00 hasta las 22:00**

---

## En Caso de Problema

### El backend no inicia
```powershell
# Verificar Python instalado
python --version

# Verificar venv activo (debe ver (venv) al inicio de terminal)
# Si no, ejecutar: .\venv\Scripts\activate
```

### El frontend no inicia
```powershell
# Verificar Node instalado
node --version
npm --version

# Si falta algo, reinstalar
npm install
```

### Base de datos corrupta
```powershell
# Borrar BD (se recreará automáticamente)
cd backend
del tienda.db
python main.py
```

### Puertos ocupados
```powershell
# Backend en otro puerto
# Editar backend/main.py última línea:
uvicorn.run(app, host="0.0.0.0", port=8001)

# Frontend en otro puerto
npm run dev -- -p 3001
```

---

## Checklist Pre-Entrega Final

- [ ] Todo funciona sin errores
- [ ] Base de datos existe y tiene datos
- [ ] Todos los endpoints responden
- [ ] Frontend se conecta al backend
- [ ] Documentación está completa
- [ ] Código está limpio
- [ ] Cambios están commiteados
- [ ] Rama correcta (tp6-61120-GuerreroSofia)

---

## ✨ ¡LISTO PARA ENTREGAR!

Si todos los checkboxes están marcados, el proyecto está listo.

**Buena suerte! 🍀**
