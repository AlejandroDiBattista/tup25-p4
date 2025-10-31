# Frontend - Aplicación de Agenda de Contactos

Aplicación web desarrollada con Next.js 14, React 18 y Tailwind CSS para gestión de contactos.

## Requisitos

- Node.js 18 o superior
- npm o yarn

## Instalación

```bash
npm install
```

## Ejecución

### Opción 1: Script automático (macOS/Linux)
```bash
./start.sh
```

### Opción 2: Manual
```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## Comandos Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # Páginas (Next.js App Router)
│   │   ├── page.tsx           # Página principal (listado)
│   │   ├── layout.tsx         # Layout global
│   │   ├── globals.css        # Estilos globales
│   │   └── contacts/
│   │       ├── new/
│   │       │   └── page.tsx   # Página de nuevo contacto
│   │       └── [id]/
│   │           └── page.tsx   # Página de edición
│   │
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes base (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   ├── ContactCard.tsx   # Tarjeta de contacto
│   │   └── ContactForm.tsx   # Formulario reutilizable
│   │
│   ├── services/             # Servicios de API
│   │   └── contacts.ts       # Cliente API de contactos
│   │
│   └── lib/                  # Utilidades
│       └── utils.ts          # Funciones helper (cn)
│
├── public/                   # Archivos estáticos
├── package.json             # Dependencias y scripts
├── tsconfig.json            # Configuración TypeScript
├── tailwind.config.js       # Configuración Tailwind
├── postcss.config.js        # Configuración PostCSS
├── next.config.js           # Configuración Next.js
└── start.sh                 # Script de inicio
```

## Páginas

### `/` - Listado de Contactos
- Muestra todos los contactos en tarjetas
- Búsqueda en tiempo real
- Click en tarjeta para editar

### `/contacts/new` - Nuevo Contacto
- Formulario para crear contacto
- Agregar múltiples teléfonos
- Validación de campos

### `/contacts/[id]` - Editar Contacto
- Formulario de edición
- Modificar teléfonos
- Botón de eliminar contacto

## Componentes

### ContactCard
Tarjeta visual para mostrar un contacto con:
- Nombre completo
- Email con icono
- Lista de teléfonos
- Click para navegar a edición

### ContactForm
Formulario reutilizable con:
- Campos de nombre, apellido y email
- Gestión dinámica de teléfonos
- Botones de agregar/eliminar teléfono
- Validación HTML5
- Botones de guardar/cancelar

### Componentes UI (shadcn/ui)
- **Button**: Botones con variantes (default, destructive, outline, etc.)
- **Card**: Contenedores con header, content y footer
- **Input**: Campos de entrada estilizados
- **Label**: Etiquetas para formularios

## Servicios

### API de Contactos (`services/contacts.ts`)

Cliente encapsulado para comunicación con el backend:

```typescript
// Obtener todos los contactos (con búsqueda opcional)
await contactsAPI.getContacts(search?: string)

// Obtener un contacto específico
await contactsAPI.getContact(id: number)

// Crear nuevo contacto
await contactsAPI.createContact(data: ContactCreate)

// Actualizar contacto
await contactsAPI.updateContact(id: number, data: ContactCreate)

// Eliminar contacto
await contactsAPI.deleteContact(id: number)
```

## Tecnologías

- **Next.js 14**: Framework React con App Router
- **React 18**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de CSS
- **shadcn/ui**: Componentes de UI
- **Lucide React**: Iconos SVG

## Características

### Diseño Responsivo
- Grid adaptativo para diferentes tamaños de pantalla
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl

### Interactividad
- Búsqueda en tiempo real
- Navegación fluida sin recarga de página
- Estados de carga (loading, submitting)
- Confirmación antes de eliminar

### UX/UI
- Feedback visual con estados hover
- Transiciones suaves
- Mensajes de error
- Diseño limpio y moderno
- Accesibilidad con labels y aria-labels

## Estilos

### Tailwind CSS
Utiliza un sistema de utilidades con:
- Variables CSS para temas
- Modo oscuro preparado (dark mode)
- Clases personalizadas para componentes
- Sistema de colores semántico

### Variables de Tema
Definidas en `globals.css`:
- `--background`, `--foreground`
- `--primary`, `--secondary`
- `--accent`, `--muted`
- `--destructive`
- `--border`, `--input`, `--ring`

## Configuración

### API Base URL
La URL del backend está configurada en `src/services/contacts.ts`:
```typescript
const API_BASE_URL = "http://localhost:8000/api";
```

Para cambiar a otro servidor, modifica esta constante.

## Desarrollo

### Hot Reload
Next.js incluye recarga automática en desarrollo. Los cambios se reflejan instantáneamente.

### TypeScript
El proyecto usa TypeScript estricto. Los tipos están definidos en:
- Interfaces en `services/contacts.ts`
- Props de componentes
- Event handlers

## Despliegue

### Build para Producción
```bash
npm run build
```

### Iniciar en Producción
```bash
npm start
```

### Variables de Entorno
Crea un archivo `.env.local` para variables de entorno:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Solución de Problemas

### El frontend no se conecta al backend
1. Verifica que el backend esté corriendo en `http://localhost:8000`
2. Revisa la consola del navegador para errores de CORS
3. Confirma que la URL del API sea correcta

### Errores de compilación TypeScript
```bash
# Borrar cache y reinstalar
rm -rf .next node_modules
npm install
```

### Puerto 3000 en uso
```bash
# Iniciar en otro puerto
PORT=3001 npm run dev
```

## Mejoras Futuras

- [ ] Paginación del listado
- [ ] Ordenamiento de contactos
- [ ] Filtros avanzados
- [ ] Exportar contactos
- [ ] Importar contactos desde CSV
- [ ] Fotos de perfil
- [ ] Grupos de contactos
- [ ] Testing con Jest y React Testing Library
- [ ] Modo oscuro completo
- [ ] PWA (Progressive Web App)
