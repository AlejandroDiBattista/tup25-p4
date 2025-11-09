Aquí tienes el texto del PDF completamente **formateado en Markdown**, listo para copiar y pegar en tu archivo `.md` con estructura clara, listas y resaltado correcto:

---

# 🧾 TP6: 2do Parcial

El **Trabajo Práctico 2** será evaluado como el **2do parcial**.
El trabajo es **individual** y debe ser realizado en el **repositorio personal de cada alumno**.

📅 **Fecha de entrega:**
**Miércoles 12 de Noviembre**, desde las **21:00 hs** hasta las **22:00 hs**.

---

## 🎯 Objetivo

Desarrollar un sitio de **comercio electrónico simple** utilizando:

* **Frontend:** React (Next.js con Tailwind CSS & Shadcn UI)
* **Backend:** FastAPI (API RESTful con SQLModel + SQLite)

---

## ⚙️ Funcionalidad

* Registrar usuario
* Iniciar sesión
* Cerrar sesión
* Ver resumen de compras
* Ver detalle de compras
* Buscar productos (por contenido y categoría)
* Agregar productos al carrito
* Quitar productos del carrito
* Cancelar compra
* Finalizar compra

---

## 🧩 Estructura de la Base de Datos

**Usuario**

* `id`
* `nombre`
* `email`
* `contraseña` (hashed)

**Producto**

* `id`
* `nombre`
* `descripción`
* `precio`
* `categoría`
* `existencia`

**Carrito**

* `id`
* `usuario_id`
* `estado`
* `productos` (lista de productos con cantidad)

**Item del Carrito**

* `producto_id`
* `cantidad`

**Compra**

* `id`
* `usuario_id`
* `fecha`
* `dirección`
* `tarjeta`
* `total`
* `envío`

**Item de Compra**

* `producto_id`
* `cantidad`
* `nombre`
* `precio_unitario`

---

## 🔗 Endpoints de la API

| Método   | Endpoint                | Descripción                                                                  |
| :------- | :---------------------- | :--------------------------------------------------------------------------- |
| `POST`   | `/registrar`            | Registrar un nuevo usuario                                                   |
| `POST`   | `/iniciar-sesion`       | Iniciar sesión y obtener token de autenticación                              |
| `POST`   | `/cerrar-sesion`        | Cerrar sesión (invalidar token)                                              |
| `GET`    | `/productos`            | Obtener lista de productos (con filtros opcionales por categoría y búsqueda) |
| `GET`    | `/productos/{id}`       | Obtener detalles de un producto específico                                   |
| `POST`   | `/carrito`              | Agregar producto al carrito                                                  |
| `DELETE` | `/carrito/{product_id}` | Quitar producto del carrito                                                  |
| `GET`    | `/carrito`              | Ver contenido del carrito                                                    |
| `POST`   | `/carrito/finalizar`    | Finalizar compra                                                             |
| `POST`   | `/carrito/cancelar`     | Cancelar compra (vaciar carrito)                                             |
| `GET`    | `/compras`              | Ver resumen de compras del usuario                                           |
| `GET`    | `/compras/{id}`         | Ver detalle de una compra específica                                         |

---

## 🖥️ Pantallas Principales

1. Pantalla de registro e inicio de sesión
2. Pantalla de listado de productos con búsqueda y filtros / carrito de compras
3. Pantalla de finalización de compra (carrito + dirección y detalles de pago)
4. Pantalla de compras anteriores (resumen + detalle)

---

## 🔄 Flujo de Trabajo

1. El usuario se registra e inicia sesión.
2. Navega por los productos, utilizando búsqueda y filtro por categoría.
3. Agrega productos al carrito.
4. Revisa el carrito y puede eliminar productos si lo desea.
5. Finaliza la compra proporcionando dirección y detalles de pago.
6. Puede ver un resumen de sus compras anteriores.

---

## 📜 Reglas de Uso

* Solo se puede agregar productos al carrito si hay **existencia disponible**.
* El usuario debe estar **autenticado** para realizar compras y ver su historial.
* El **precio total** se calcula sumando el precio unitario por cantidad de cada producto.
* El **IVA** es del **21%** del total de la compra (excepto productos electrónicos, que tienen **10%**).
* El **envío es gratuito** para compras superiores a **$1000**, de lo contrario tiene un **costo fijo de $50**.
* Los productos solo pueden ser eliminados del carrito si este **no ha sido finalizado**.
* Una vez finalizada la compra, el carrito se vacía y se crea un **registro de compra**.
* Los productos sin existencias deben mostrarse como **“Agotados”** y no se pueden agregar al carrito.

---

## 🧠 Consideraciones Adicionales

* Realizar **pruebas unitarias** para los endpoints de la API.
* Implementar **manejo de errores adecuado** (por ejemplo: usuario no encontrado, producto agotado, etc.).
* Cargar **datos iniciales** de productos en la base de datos para pruebas.
* Los datos de productos se encuentran en el archivo **`productos.json`**, y las imágenes en la carpeta **`/imagenes`**.

---

## 📦 Instrucciones para la Entrega

> **[!NOTA]**
> El trabajo debe ser entregado el **Miércoles 12 de Noviembre**, entre las **21:00 y 22:00 hs**.

Durante el desarrollo se deben realizar **commits frecuentes y descriptivos** (mínimo **10 commits**).

---

¿Querés que te lo formatee con encabezados numerados estilo “1️⃣, 2️⃣, 3️⃣” o prefieres dejarlo con íconos y emojis como está ahora?
