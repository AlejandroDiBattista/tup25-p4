# Componentes Auxiliares del Chat

Este directorio contiene componentes auxiliares que simplifican la construcción de la aplicación de chat. Cada componente tiene una responsabilidad clara y es fácil de entender y usar.

## 📦 Componentes Disponibles

### 1. **ChatContainer**
Contenedor principal que maneja el layout y estructura básica del chat.

```tsx
<ChatContainer>
  {/* Tu contenido aquí */}
</ChatContainer>
```

**Responsabilidad**: Proporciona el contenedor responsive con padding y altura completa.

---

### 2. **ChatMessages**
Contenedor de mensajes con scroll automático.

```tsx
<ChatMessages>
  {messages.map(message => (
    <ChatMessage key={message.id} {...message} />
  ))}
</ChatMessages>
```

**Responsabilidad**: Gestiona la lista de mensajes y el botón de scroll automático.

---

### 3. **ChatMessage**
Renderiza un mensaje individual con sus acciones.

```tsx
<ChatMessage
  role="user" // o "assistant"
  content="Texto del mensaje"
  isLastMessage={true}
  onRegenerate={() => regenerate()}
  onCopy={(text) => navigator.clipboard.writeText(text)}
/>
```

**Props**:
- `role`: Tipo de mensaje ('user' | 'assistant')
- `content`: Contenido del mensaje
- `isLastMessage`: Si es el último mensaje (muestra acciones)
- `onRegenerate`: Función para regenerar la respuesta
- `onCopy`: Función para copiar el texto

**Responsabilidad**: Muestra un mensaje con botones de acción (Retry, Copy) cuando corresponde.

---

### 4. **ChatReasoning**
Muestra el proceso de pensamiento de la IA.

```tsx
<ChatReasoning
  content="Proceso de razonamiento..."
  isStreaming={true}
/>
```

**Props**:
- `content`: Texto del razonamiento
- `isStreaming`: Si está en proceso de streaming

**Responsabilidad**: Renderiza el razonamiento en un componente colapsable.

---

### 5. **ChatSources**
Muestra las fuentes consultadas por el asistente.

```tsx
<ChatSources
  sources={[
    { url: 'https://example.com', title: 'Ejemplo' }
  ]}
/>
```

**Props**:
- `sources`: Array de objetos con `url` y `title` opcionales

**Responsabilidad**: Muestra fuentes de forma colapsable con contador.

---

### 6. **ChatInput**
Campo de entrada completo con todas las opciones.

```tsx
<ChatInput
  value={input}
  onChange={setInput}
  onSubmit={handleSubmit}
  status={status}
  selectedModel={model}
  onModelChange={setModel}
  availableModels={models}
  webSearchEnabled={webSearch}
  onWebSearchToggle={() => setWebSearch(!webSearch)}
/>
```

**Props**:
- `value`: Valor del input
- `onChange`: Función para actualizar el input
- `onSubmit`: Función al enviar el mensaje
- `status`: Estado del chat ('idle' | 'streaming' | 'submitted')
- `selectedModel`: Modelo seleccionado actualmente
- `onModelChange`: Función para cambiar el modelo
- `availableModels`: Array de modelos disponibles
- `webSearchEnabled`: Si la búsqueda web está activa
- `onWebSearchToggle`: Función para toggle de búsqueda web

**Responsabilidad**: Gestiona toda la entrada del usuario incluyendo:
- Campo de texto
- Adjuntar archivos
- Selector de modelo
- Toggle de búsqueda web
- Botón de envío

---

### 7. **ChatLoader**
Indicador visual de carga.

```tsx
{status === 'submitted' && <ChatLoader />}
```

**Responsabilidad**: Muestra un spinner mientras se procesa la respuesta.

---

## 🎯 Ejemplo de Uso Completo

```tsx
'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import {
  ChatContainer,
  ChatMessages,
  ChatMessage,
  ChatReasoning,
  ChatSources,
  ChatInput,
  ChatLoader,
} from './components';

const models = [
  { name: 'GPT 4o', value: 'openai/gpt-4o' },
  { name: 'GPT 5', value: 'openai/gpt-5' },
];

export default function ChatApp() {
  // Estado
  const [input, setInput] = useState('');
  const [model, setModel] = useState(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  
  // Hook de chat
  const { messages, sendMessage, status, regenerate } = useChat();

  // Handler de envío
  const handleSubmit = (message) => {
    sendMessage(
      { text: message.text },
      { body: { model, webSearch } }
    );
    setInput('');
  };

  return (
    <ChatContainer>
      <ChatMessages>
        {messages.map((message) => (
          <div key={message.id}>
            {/* Renderiza mensaje */}
            <ChatMessage
              role={message.role}
              content={message.content}
              isLastMessage={message.id === messages.at(-1)?.id}
              onRegenerate={regenerate}
              onCopy={(text) => navigator.clipboard.writeText(text)}
            />
          </div>
        ))}
        {status === 'submitted' && <ChatLoader />}
      </ChatMessages>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        status={status}
        selectedModel={model}
        onModelChange={setModel}
        availableModels={models}
        webSearchEnabled={webSearch}
        onWebSearchToggle={() => setWebSearch(!webSearch)}
      />
    </ChatContainer>
  );
}
```

## 🔧 Tipos Disponibles

```typescript
import type { 
  ChatStatus,      // 'idle' | 'streaming' | 'submitted'
  MessageRole,     // 'user' | 'assistant'
  MessagePart,     // Parte de un mensaje
  ChatMessageData, // Datos completos de un mensaje
  Model            // Definición de modelo
} from './components';
```

## 💡 Ventajas de este Enfoque

1. **Claridad**: Cada componente tiene un propósito obvio
2. **Reusabilidad**: Los componentes pueden usarse en diferentes contextos
3. **Mantenibilidad**: Cambios en un componente no afectan a los demás
4. **Testabilidad**: Componentes pequeños son fáciles de testear
5. **Documentación implícita**: Los nombres y props son autodescriptivos

## 🚀 Próximos Pasos

Para extender el chat, simplemente:
1. Agrega nuevos componentes en este directorio
2. Expórtalos en `index.ts`
3. Úsalos en `page.tsx`

Ejemplo: agregar soporte para imágenes
```tsx
// ChatImage.tsx
export const ChatImage = ({ src, alt }) => {
  return <img src={src} alt={alt} className="rounded-lg" />;
};
```
