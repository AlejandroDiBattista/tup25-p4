# HTTP Client Universal - Documentación

## 🎯 Descripción

`http.ts` es un cliente HTTP universal que funciona tanto en **Client Components** como en **Server Components** de Next.js.

## ✨ Características

### 1. **Detección Automática de Entorno**
```typescript
const isServer = typeof window === 'undefined';
```
- Detecta automáticamente si está ejecutándose en servidor o cliente
- Ajusta la URL base según el contexto

### 2. **URLs Dinámicas**
```typescript
// En el servidor: http://localhost:3000/api/
// En el cliente: /api/
```
- **Servidor**: Usa URL completa (necesaria para fetch en Node.js)
- **Cliente**: Usa ruta relativa (más eficiente)

### 3. **Soporte para Next.js Cache Options**
```typescript
interface HttpOptions extends RequestInit {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}
```
- Compatible con las opciones de caché de Next.js 14+
- Soporta `revalidate` y `tags` para ISR y cache tagging

### 4. **Type Safety con TypeScript**
```typescript
const contactos = await Http.GET<Contacto[]>('contactos');
// contactos es de tipo Contacto[] | null
```

## 📖 Uso

### En Server Components
```tsx
import * as Http from "@/lib/http";

export async function ContactosListServer() {
  const contactos = await Http.GET('contactos', { 
    cache: "no-store",
    next: { revalidate: 0 }
  });
  
  return <div>{/* render */}</div>;
}
```

### En Client Components
```tsx
"use client";
import * as Http from "@/lib/http";

export function EditarContacto() {
  const handleSubmit = async () => {
    const data = await Http.PUT(`contactos/${id}`, {
      nombre: "Juan",
      edad: 30
    });
  };
}
```

### En Server Actions
```tsx
async function crearContacto(formData: FormData) {
  'use server';
  
  const data = await Http.POST('contactos', {
    nombre: formData.get('nombre'),
    edad: parseInt(formData.get('edad'))
  });
  
  redirect('/');
}
```

## 🔧 Métodos Disponibles

### GET
```typescript
GET<T>(url: string, options?: HttpOptions): Promise<T | null>
```

### POST
```typescript
POST<T>(url: string, data: any, options?: HttpOptions): Promise<T | null>
```

### PUT
```typescript
PUT<T>(url: string, data: any, options?: HttpOptions): Promise<T | null>
```

### DELETE
```typescript
DELETE<T>(url: string, options?: HttpOptions): Promise<T | null>
```

## 🌍 Variables de Entorno

Opcionalmente, puedes configurar la URL base:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api/
```

Si no se configura, usa el default: `http://localhost:3000/api/`

## ⚡ Ventajas sobre fetch directo

1. **Abstracción consistente**: Misma API en cliente y servidor
2. **Manejo de errores**: Logs automáticos de errores
3. **Type safety**: Soporte completo de TypeScript
4. **Headers automáticos**: Content-Type ya configurado
5. **Manejo de 204**: DELETE maneja correctamente No Content
6. **URL base automática**: No repetir la base URL en cada llamada

## 🔄 Migración desde Http.js

### Antes (Http.js)
```javascript
import * as Http from "@/lib/Http.js";
const data = await Http.GET('contactos/123');
```

### Después (http.ts)
```typescript
import * as Http from "@/lib/http";
const data = await Http.GET('contactos/123');
```

**¡La API es 100% compatible!** Solo cambia la importación.

## 📝 Notas Importantes

- ✅ Funciona en **ambos entornos** sin cambios
- ✅ Compatible con **Next.js 14+** features
- ✅ Soporta **cache options** de Next.js
- ✅ Type-safe con **TypeScript**
- ✅ Manejo de errores **mejorado**
- ✅ **Backward compatible** con código existente
