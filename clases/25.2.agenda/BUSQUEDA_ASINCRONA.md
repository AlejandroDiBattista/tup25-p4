# Búsqueda Asíncrona de Contactos

## Arquitectura

Esta implementación utiliza una arquitectura moderna de Next.js 14+ con Server Components y actualizaciones asíncronas.

### Componentes

1. **`page.tsx`** (Server Component)
   - Componente principal de la página
   - Recibe los `searchParams` de la URL
   - Orquesta la UI con Suspense boundaries

2. **`SearchForm`** (Client Component)
   - Maneja la entrada de búsqueda del usuario
   - Usa `useTransition` para actualizaciones asíncronas sin bloquear la UI
   - Actualiza la URL usando `router.push()` con `startTransition`
   - Muestra un spinner de loading durante la búsqueda

3. **`ContactosListServer`** (Server Component)
   - Realiza el fetch de datos en el servidor
   - Se re-renderiza automáticamente cuando cambian los `searchParams`
   - Mantiene toda la lógica de datos en el servidor

### Flujo de Actualización

```
Usuario escribe → SearchForm actualiza URL → Next.js re-renderiza page.tsx →
Suspense muestra skeleton → ContactosListServer fetch datos → 
Muestra resultados actualizados
```

### Ventajas

✅ **Asíncrono**: La búsqueda no bloquea la interfaz
✅ **Servidor**: Los datos se procesan en el servidor (mejor seguridad y SEO)
✅ **Progressive Enhancement**: Funciona sin JavaScript básico
✅ **UX Mejorada**: Loading states y transiciones suaves
✅ **URL State**: La búsqueda está en la URL (bookmarkable, shareable)

### Características Técnicas

- **Suspense Boundaries**: Permite streaming de componentes
- **useTransition**: Marca actualizaciones como transiciones (no bloqueantes)
- **Server Components**: Zero JavaScript en el bundle del cliente para la lista
- **Cache Control**: `cache: "no-store"` para datos siempre frescos
- **Key Prop en Suspense**: `key={searchTerm}` fuerza re-fetch al cambiar búsqueda

## Uso

La búsqueda se actualiza automáticamente mientras escribes. El componente:
- Muestra un spinner mientras busca
- Desactiva el input durante la búsqueda
- Actualiza la tabla sin recargar la página completa
