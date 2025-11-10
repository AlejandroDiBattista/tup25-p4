# TP6: E-Commerce - Sistema de Comercio Electrónico

**Alumno:** Donelli, Gerardo Exequíel  
**Legajo:** 61271  
**Materia:** Técnicas y Herramientas Modernas (TUP)  
**Año:** 2025

---

##  Descripción

Sistema de comercio electrónico completo desarrollado con FastAPI (backend) y Next.js (frontend). Permite a los usuarios registrarse, navegar productos, gestionar un carrito de compras y realizar compras con cálculo automático de IVA y costos de envío.

---

##  Tecnologías Utilizadas

### **Backend**
- **FastAPI** 0.115.5+ - Framework web moderno y rápido
- **SQLModel** 0.0.27 - ORM con soporte de Pydantic
- **SQLite** - Base de datos embebida
- **JWT** - Autenticación con tokens (python-jose 3.5.0)
- **bcrypt** 5.0.0 - Hashing seguro de contraseñas
- **pytest** - Testing con 32 tests unitarios

### **Frontend**
- **Next.js** 16.0.1 - Framework de React
- **React** 19.2.0 - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** 4 - Framework de estilos
- **Context API** - Gestión de estado global

---

##  Instalación y Configuración

### **Requisitos Previos**
- Python 3.11+
- Node.js 18+
- npm o yarn
- uv (gestor de paquetes Python)

### **1. Configurar Backend**

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias con uv
uv sync

# La base de datos se creará automáticamente al iniciar
# Los productos se cargarán desde productos.json
```

### **2. Configurar Frontend**

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# El archivo .env.local ya existe con la configuración correcta
```

---

##  Ejecución

### **Iniciar Backend**

```bash
cd backend
uv run uvicorn main:app --reload
```

El backend estará disponible en: **http://localhost:8000**  
Documentación API: **http://localhost:8000/docs**

### **Iniciar Frontend**

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: **http://localhost:3000**

---

##  Testing

### **Ejecutar Tests del Backend**

```bash
cd backend

# Ejecutar todos los tests
uv run pytest test_main.py -v

# Resultado esperado: 32 passed
```

**Resultados:**
-  32 tests pasando
-  Cobertura completa de endpoints
-  Tests de autenticación, productos, carrito y compras

---

##  API Endpoints

### **Autenticación**
- POST /registrar - Registrar nuevo usuario
- POST /iniciar-sesion - Iniciar sesión (obtener token JWT)
- POST /cerrar-sesion - Cerrar sesión (requiere auth)

### **Productos**
- GET /productos - Listar productos (filtros: categoria, buscar)
- GET /productos/{id} - Obtener detalle de producto

### **Carrito**
- POST /carrito - Agregar producto al carrito
- GET /carrito - Ver contenido del carrito
- DELETE /carrito/{id} - Eliminar producto del carrito
- POST /carrito/cancelar - Vaciar carrito completo
- POST /carrito/finalizar - Finalizar compra

### **Compras**
- GET /compras - Historial de compras del usuario
- GET /compras/{id} - Detalle de una compra específica

---

##  Funcionalidades Implementadas

###  **Autenticación y Usuarios**
- Registro de usuarios con validación de email único
- Inicio de sesión con JWT (tokens válidos por 7 días)
- Cierre de sesión con invalidación de token
- Protección de rutas con middleware de autenticación
- Hashing seguro de contraseñas con bcrypt

###  **Gestión de Productos**
- Catálogo de 20 productos en 4 categorías
- Filtrado por categoría (Electrónica, Ropa, Hogar, Deportes)
- Búsqueda por texto (nombre/descripción)
- Visualización de stock disponible
- Productos agotados no agregables al carrito

###  **Carrito de Compras**
- Agregar productos con validación de stock
- Ver carrito con subtotales por producto
- Eliminar productos individuales
- Vaciar carrito completo
- Validación de cantidad vs. stock disponible

###  **Proceso de Compra**
- Checkout con dirección de envío (mínimo 10 caracteres)
- Validación de tarjeta (4 dígitos)
- Cálculo automático de IVA:
  - 10% para Electrónica
  - 21% para otras categorías
- Cálculo de envío:
  - Gratis si subtotal > $1000
  - $50 fijo si subtotal  $1000
- Reducción automática de stock al finalizar
- Snapshot de productos (precio al momento de compra)

###  **Historial de Compras**
- Listado de todas las compras del usuario
- Detalle completo de cada compra
- Visualización de productos con precios históricos
- Desglose de subtotal, IVA, envío y total

---

##  Reglas de Negocio

1. **Stock:** Solo se pueden agregar productos con existencia > 0
2. **Autenticación:** Carrito y compras requieren usuario autenticado
3. **IVA:** 10% Electrónica, 21% resto de categorías
4. **Envío:** Gratis si subtotal > $1000, sino $50
5. **Snapshot:** Productos guardados con precio al momento de compra
6. **Carrito:** Se vacía automáticamente al finalizar compra
7. **Ownership:** Usuarios solo ven sus propias compras y carritos

---

##  Commits Realizados

1.  **Commit 1:** Configuración de modelos y base de datos SQLite
2.  **Commit 2:** Implementación de autenticación JWT con bcrypt
3.  **Commit 3:** Carga de 20 productos desde JSON
4.  **Commit 4:** Endpoints de productos con filtros
5.  **Commit 5:** Gestión de carrito (agregar, ver, eliminar, cancelar)
6.  **Commit 6:** Finalización de compra con IVA y envío
7.  **Commit 7:** Historial de compras (backend)
8.  **Commit 8:** Tests unitarios completos (32 tests)
9.  **Commit 9:** Autenticación y registro en frontend
10.  **Commit 10:** Productos, filtros, carrito y checkout (frontend)
11.  **Commit 11:** Historial de compras en frontend

**Total: 11 commits** (Supera el mínimo requerido de 10)

---

##  Autor

**Gerardo Exequíel Donelli**  
Legajo: 61271  
TUP - Técnicas y Herramientas Modernas  
Universidad Tecnológica Nacional

---

##  Licencia

Este proyecto es parte de un trabajo práctico universitario y tiene fines educativos.
