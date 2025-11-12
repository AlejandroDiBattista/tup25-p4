# 🚀 Guía Rápida Visual

## En 3 Pasos Simples

### Paso 1: Importar componentes
```tsx
import {
  ChatContainer,    // 📦 Contenedor
  ChatMessages,     // 💬 Lista de mensajes
  ChatMessage,      // 📝 Mensaje individual
  ChatInput,        // ⌨️ Campo de entrada
  ChatLoader,       // ⏳ Cargando
} from './components';
```

### Paso 2: Configurar el estado
```tsx
const [input, setInput] = useState('');
const [model, setModel] = useState('openai/gpt-4o');
const { messages, sendMessage, status, regenerate } = useChat();
```

### Paso 3: Componer el UI
```tsx
<ChatContainer>
  <ChatMessages>
    {messages.map(msg => <ChatMessage {...msg} />)}
    {status === 'submitted' && <ChatLoader />}
  </ChatMessages>
  <ChatInput {...props} />
</ChatContainer>
```

---

## 🎨 Componentes Visualizados

### ChatContainer
```
┌─────────────────────────────┐
│   📦 Contenedor Principal   │
│   - Max width 4xl           │
│   - Padding automático      │
│   - Height completa         │
└─────────────────────────────┘
```

### ChatMessages
```
┌─────────────────────────────┐
│   💬 Lista de Mensajes      │
│   ┌─────────────────────┐   │
│   │ Mensaje 1           │   │
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │ Mensaje 2           │   │
│   └─────────────────────┘   │
│   [⬇️ Scroll automático]    │
└─────────────────────────────┘
```

### ChatMessage
```
┌─────────────────────────────┐
│ 👤 [Usuario/Asistente]      │
│ Contenido del mensaje...    │
│                             │
│ [🔄 Retry] [📋 Copy]       │
└─────────────────────────────┘
```

### ChatInput
```
┌─────────────────────────────┐
│ 📎 Archivos adjuntos        │
├─────────────────────────────┤
│ ⌨️ Escribe un mensaje...    │
├─────────────────────────────┤
│ [📎][🌐][🤖 GPT-4o][➤]    │
└─────────────────────────────┘
```

---

## 🎯 Propiedades Esenciales

### ChatMessage Props
```tsx
{
  role: 'user' | 'assistant',    // 👤 Quién habla
  content: string,                // 💬 Qué dice
  isLastMessage: boolean,         // 🏁 Es el último?
  onRegenerate: () => void,       // 🔄 Regenerar
  onCopy: (text) => void,         // 📋 Copiar
}
```

### ChatInput Props
```tsx
{
  value: string,                  // ⌨️ Texto actual
  onChange: (text) => void,       // 📝 Al cambiar texto
  onSubmit: (msg) => void,        // ✉️ Al enviar
  status: ChatStatus,             // 📊 Estado del chat
  selectedModel: string,          // 🤖 Modelo activo
  onModelChange: (m) => void,     // 🔀 Cambiar modelo
  availableModels: Model[],       // 📋 Modelos disponibles
  webSearchEnabled: boolean,      // 🌐 Búsqueda web
  onWebSearchToggle: () => void,  // 🔄 Toggle búsqueda
}
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Chat Básico
```tsx
<ChatContainer>
  <ChatMessages>
    {messages.map(msg => (
      <ChatMessage 
        key={msg.id}
        role={msg.role}
        content={msg.content}
      />
    ))}
  </ChatMessages>
  <ChatInput 
    value={input}
    onChange={setInput}
    onSubmit={handleSubmit}
  />
</ChatContainer>
```

### Ejemplo 2: Con Razonamiento
```tsx
{parts.map((part, i) => {
  switch (part.type) {
    case 'text':
      return <ChatMessage {...part} />;
    case 'reasoning':
      return <ChatReasoning content={part.text} />;
  }
})}
```

### Ejemplo 3: Con Fuentes
```tsx
{message.role === 'assistant' && sources.length > 0 && (
  <ChatSources sources={sources} />
)}
```

---

## 🔄 Flujo Típico

```
1️⃣ Usuario escribe en ChatInput
          ↓
2️⃣ onSubmit se ejecuta
          ↓
3️⃣ useChat.sendMessage()
          ↓
4️⃣ API procesa /api/chat
          ↓
5️⃣ Streaming response
          ↓
6️⃣ messages array se actualiza
          ↓
7️⃣ ChatMessages re-renderiza
          ↓
8️⃣ Nuevo ChatMessage aparece
```

---

## 📦 Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `README.md` | 📖 Documentación completa |
| `ARCHITECTURE.md` | 🏗️ Estructura visual |
| `example-simple.tsx` | 🎯 Ejemplo mínimo |
| `SUMMARY.md` | 📊 Resumen ejecutivo |
| `QUICK-START.md` | ⚡ Esta guía |

---

## ✨ Tips Rápidos

### Para entender el código:
1. Empieza por `example-simple.tsx` (más simple)
2. Luego lee `page.tsx` (implementación completa)
3. Explora cada componente en `components/`

### Para modificar:
1. Identifica qué componente necesitas cambiar
2. Abre solo ese archivo
3. Modifica sin afectar el resto

### Para extender:
1. Crea un nuevo componente en `components/`
2. Expórtalo en `index.ts`
3. Úsalo en `page.tsx`

---

**¡Ahora puedes construir un chat de IA en minutos!** 🎉
