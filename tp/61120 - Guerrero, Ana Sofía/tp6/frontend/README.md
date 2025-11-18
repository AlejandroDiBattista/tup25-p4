# Frontend - Tienda Electrónica

## Descripción
Frontend desarrollado con Next.js 14, React 18, Tailwind CSS y Zustand para un sitio de comercio electrónico.

## Requisitos
- Node.js 18+
- npm o yarn

## Instalación

1. Navega a la carpeta frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env.local` basado en `.env.example`:
```bash
cp .env.example .env.local
```

4. Configura la URL del API en `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Ejecución

### Modo desarrollo:
```bash
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

### Modo producción:
```bash
npm run build
npm run start
```

## Estructura

```
frontend/
├── app/                    # App Router de Next.js
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página de inicio
│   ├── globals.css         # Estilos globales
│   ├── login/page.tsx      # Página de login
│   ├── registro/page.tsx   # Página de registro
│   ├── carrito/page.tsx    # Página del carrito
│   ├── checkout/page.tsx   # Página de checkout
│   └── compras/
│       ├── page.tsx        # Historial de compras
│       └── [id]/page.tsx   # Detalle de compra
├── components/             # Componentes React
│   ├── navbar.tsx
│   ├── product-card.tsx
│   ├── search-bar.tsx
│   └── category-filter.tsx
├── lib/
│   └── api-client.ts       # Cliente HTTP para la API
├── store/
│   └── index.ts            # Store de Zustand (auth y carrito)
├── public/                 # Archivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## Características

- ✅ Autenticación con JWT
- ✅ Página de registro e inicio de sesión
- ✅ Listado de productos con búsqueda y filtros
- ✅ Carrito de compras
- ✅ Checkout con validación
- ✅ Historial de compras
- ✅ Responsive design
- ✅ Gestión de estado con Zustand

## Variables de Entorno

Ver `.env.example` para las variables necesarias.

## Dependencias Principales

- **next**: Framework React con SSR
- **react**: Librería UI
- **zustand**: Gestión de estado
- **axios**: Cliente HTTP
- **tailwindcss**: Framework CSS
- **lucide-react**: Iconos
- **typescript**: Type safety

## Flujo de Autenticación

1. Usuario se registra o inicia sesión
2. Backend devuelve un JWT token
3. Token se guarda en el store de Zustand (localStorage)
4. El API client agrega automáticamente el token a todas las requests
5. Si el token es inválido, se redirige al login

## Notas de Desarrollo

- El estado del carrito se persiste en localStorage
- Las imágenes se cargan desde la URL de la API
- CORS está habilitado en el backend
- Se usa TypeScript para type safety

## Contacto

Para más información, ver `/README.md` en la raíz del proyecto.
