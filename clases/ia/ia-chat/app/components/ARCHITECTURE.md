# Arquitectura de Componentes del Chat

## 🏗️ Estructura Visual

```
┌─────────────────────────────────────────────────────────────┐
│                      ChatContainer                          │
│  (Layout principal: max-w-4xl, padding, height completa)   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                   ChatMessages                        │ │
│  │  (Contenedor con scroll automático)                   │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  ChatSources (opcional)                        │ │ │
│  │  │  - Muestra fuentes consultadas                 │ │ │
│  │  │  - Solo para mensajes del asistente            │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  ChatMessage                                    │ │ │
│  │  │  - Avatar + contenido                           │ │ │
│  │  │  - Botones de acción (Retry, Copy)             │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  ChatReasoning (opcional)                       │ │ │
│  │  │  - Proceso de pensamiento de la IA             │ │ │
│  │  │  - Colapsable, con indicador de streaming      │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  ChatLoader (condicional)                       │ │ │
│  │  │  - Se muestra cuando status === 'submitted'    │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                    ChatInput                          │ │
│  │  (Campo de entrada con todas las opciones)           │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Header: Archivos adjuntos                     │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Body: Textarea                                 │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Footer: Botones y opciones                     │ │ │
│  │  │   [📎] [🌐 Search] [🤖 Model] [Enviar ➤]       │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

```
Usuario escribe mensaje
        ↓
    ChatInput
        ↓
   handleSubmit
        ↓
    useChat hook
        ↓
   API /api/chat
        ↓
   Streaming response
        ↓
   messages array
        ↓
   ChatMessages
        ↓
   [ChatSources]
   ChatMessage
   [ChatReasoning]
```

## 📦 Responsabilidades por Componente

### ChatContainer
- ✅ Layout responsive
- ✅ Padding y márgenes
- ✅ Estructura flex vertical

### ChatMessages
- ✅ Scroll automático
- ✅ Contenedor de mensajes
- ✅ Botón de scroll

### ChatMessage
- ✅ Renderizar mensaje individual
- ✅ Avatar según rol
- ✅ Acciones (Retry, Copy)

### ChatReasoning
- ✅ Mostrar razonamiento
- ✅ Colapsable
- ✅ Indicador de streaming

### ChatSources
- ✅ Lista de fuentes
- ✅ Contador de fuentes
- ✅ Enlaces a recursos

### ChatInput
- ✅ Entrada de texto
- ✅ Adjuntar archivos
- ✅ Selector de modelo
- ✅ Toggle búsqueda web
- ✅ Botón de envío

### ChatLoader
- ✅ Indicador visual
- ✅ Animación de carga

## 🎯 Ventajas del Diseño

1. **Separación de Responsabilidades**
   - Cada componente hace una cosa y la hace bien
   - Fácil de entender y mantener

2. **Composición Clara**
   - Se ve inmediatamente cómo se construye el chat
   - Fácil agregar o quitar funcionalidad

3. **Reusabilidad**
   - Componentes pueden usarse en otros contextos
   - No están acoplados a la implementación específica

4. **Testing**
   - Componentes pequeños son fáciles de testear
   - Pueden probarse de forma aislada

5. **Extensibilidad**
   - Agregar nuevos tipos de contenido es simple
   - Solo crear un nuevo componente y agregarlo

## 🚀 Ejemplo de Extensión

Para agregar soporte para imágenes:

```tsx
// 1. Crear componente
export const ChatImage = ({ src, alt }: { src: string; alt: string }) => {
  return <img src={src} alt={alt} className="rounded-lg max-w-md" />;
};

// 2. Agregarlo al switch en page.tsx
case 'image':
  return (
    <ChatImage
      key={`${message.id}-${i}`}
      src={part.url ?? ''}
      alt={part.text ?? 'Image'}
    />
  );
```

¡Así de simple!
