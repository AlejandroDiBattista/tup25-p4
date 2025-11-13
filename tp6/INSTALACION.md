# 🚀 Guía de Instalación Rápida - TP6 Tienda Electrónica

## ⚡ Pasos Rápidos (5 minutos)

### 1️⃣ Backend (Terminal 1)

```powershell
# Navegar al backend
cd tp6/backend

# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
.\venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python main.py
```

✅ Backend disponible en: http://localhost:8000
📚 Documentación: http://localhost:8000/docs

### 2️⃣ Frontend (Terminal 2)

```powershell
# Navegar al frontend
cd tp6/frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

✅ Frontend disponible en: http://localhost:3000

---

## 📋 Checklist de Instalación

- [ ] Backend ejecutándose (puerto 8000)
- [ ] Frontend ejecutándose (puerto 3000)
- [ ] Navegador muestra la página principal
- [ ] Base de datos creada (`backend/tienda.db`)

---

## 🧪 Pruebas Rápidas

### Probar Backend API

Abrir en navegador: http://localhost:8000/docs

Pruebas disponibles:
1. Registrar usuario
2. Iniciar sesión
3. Ver productos
4. Operaciones de carrito

### Probar Frontend

1. Abrir http://localhost:3000
2. Hacer clic en "Registrarse"
3. Crear una cuenta de prueba
4. Explorar productos
5. Agregar al carrito
6. Realizar compra

---

## 🔧 Solucionar Problemas

### Puerto 8000 ocupado (Backend)
```powershell
# Cambiar puerto en backend/main.py línea final
# uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Puerto 3000 ocupado (Frontend)
```powershell
npm run dev -- -p 3001
```

### Error de módulos en Backend
```powershell
# Reinstalar dependencias
pip install --upgrade -r requirements.txt
```

### Error de módulos en Frontend
```powershell
# Limpiar caché y reinstalar
rm -r node_modules package-lock.json
npm install
```

### Base de datos corrupta
```powershell
# Borrar BD y será recriada al iniciar
del backend/tienda.db
```

---

## 📂 Estructura Esperada

```
tp6/
├── backend/
│   ├── venv/                    (se crea con python -m venv)
│   ├── tienda.db               (se crea al ejecutar)
│   └── main.py                 (punto de entrada)
└── frontend/
    └── node_modules/           (se crea con npm install)
```

---

## 🎯 URLs Importantes

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Docs API | http://localhost:8000/docs |
| ReDoc API | http://localhost:8000/redoc |

---

## 👤 Datos de Prueba

**Usuario de prueba (crear tu propia cuenta):**
- Email: test@example.com
- Contraseña: password123

**Productos de ejemplo:**
- Se cargan automáticamente al iniciar el backend
- 10 productos disponibles

---

## 📝 Notas Importantes

1. **Base de datos**: SQLite, se crea automáticamente
2. **Autenticación**: JWT con expiración de 30 minutos
3. **CORS**: Habilitado para localhost:3000
4. **Imágenes**: Son URLs de ejemplo (no funcionan realmente)
5. **Tarjeta**: No se procesa, es solo para simular

---

## 🎮 Cómo Usar

### Flujo Completo:

1. **Registrarse** → `/registro`
2. **Iniciar Sesión** → `/login`
3. **Ver Productos** → `/` (inicio)
4. **Buscar/Filtrar** → Usar barra de búsqueda
5. **Agregar al Carrito** → Click en producto
6. **Ver Carrito** → `/carrito`
7. **Checkout** → `/checkout`
8. **Ver Compras** → `/compras`

---

## ✅ Requisitos Cumplidos

- ✅ Registración de usuario
- ✅ Inicio de sesión
- ✅ Cierre de sesión
- ✅ Ver resumen de compras
- ✅ Ver detalle de compras
- ✅ Buscar productos
- ✅ Filtrar por categoría
- ✅ Agregar al carrito
- ✅ Quitar del carrito
- ✅ Cancelar compra
- ✅ Finalizar compra
- ✅ Cálculo de IVA (21% / 10%)
- ✅ Cálculo de envío (gratis >$1000, $50 sino)
- ✅ Control de existencia
- ✅ Pruebas unitarias
- ✅ Documentación API

---

**¡Listo para usar! 🎉**

Cualquier problema, revisar los logs en la terminal.
