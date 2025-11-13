# AI Coding Agent Instructions

## Project Overview
This is a Next.js 16 chat application built with React 19, using AI SDK for conversational AI. The app features a modular component architecture that breaks down complex chat UI into reusable, single-responsibility components.

## Architecture & Data Flow

### Core Components (`app/components/`)
- **ChatContainer**: Main layout wrapper with responsive design (max-w-4xl, full height)
- **ChatMessages**: Message list container with auto-scroll functionality
- **ChatMessage**: Individual message display with role-based avatars and action buttons (Retry, Copy)
- **ChatReasoning**: Collapsible AI reasoning/thinking display with streaming indicators
- **ChatSources**: Collapsible sources panel showing consulted URLs
- **ChatInput**: Complete input component with file attachments, model selection, and web search toggle
- **ChatLoader**: Loading spinner shown during message submission

### Message System
Messages use a "parts" system supporting multiple content types:
```typescript
interface MessagePart {
  type: 'text' | 'reasoning' | 'source-url';
  text?: string;
  url?: string;
}
```

### API Integration
- **Route**: `app/api/chat/route.ts` handles streaming responses using `streamText` from AI SDK
- **SDK**: Uses `@ai-sdk/react` `useChat` hook for state management
- **Models**: Supports OpenAI models with web search capability (forces GPT-4o when enabled)
- **Streaming**: Real-time responses with reasoning and sources via `toUIMessageStreamResponse`

## Key Patterns & Conventions

### Component Composition
Always compose chat UI using the modular components instead of building from scratch:
```tsx
<ChatContainer>
  <ChatMessages>
    {messages.map(msg => (
      <ChatMessage
        role={msg.role}
        content={msg.content}
        isLastMessage={isLast}
        onRegenerate={regenerate}
        onCopy={handleCopy}
      />
    ))}
    {status === 'submitted' && <ChatLoader />}
  </ChatMessages>
  <ChatInput {...inputProps} />
</ChatContainer>
```

### Message Processing
When handling messages, normalize content through the parts system:
```tsx
const parts = Array.isArray(message.parts)
  ? message.parts
  : [{ type: 'text', text: message.content }];
```

### State Management
Use the AI SDK's `useChat` hook for all chat state:
```tsx
const { messages, sendMessage, status, regenerate } = useChat();
```

## Development Workflow

### Running the App
```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Production server
npm run lint   # ESLint checking
```

### Adding New Components
1. Create component in `app/components/`
2. Export from `app/components/index.ts`
3. Add to `types.ts` if new interfaces needed
4. Update documentation in `README.md`

### File Attachments
The app supports file uploads through `ChatInput`. Handle files in submit handlers:
```tsx
const handleSubmit = (message: PromptInputMessage) => {
  sendMessage(
    { text: message.text, files: message.files },
    { body: { model, webSearch } }
  );
};
```

## UI Library Setup
- **Framework**: shadcn/ui with "new-york" style
- **Styling**: Tailwind CSS with CSS variables
- **Icons**: Lucide React
- **Components**: Radix UI primitives

## Dependencies to Know
- `@ai-sdk/react@^2.0.87`: Chat state management and streaming
- `@ai-sdk/openai@^2.0.62`: OpenAI model integration
- `ai@^6.0.0-beta.93`: Core AI SDK utilities
- `@radix-ui/*`: UI component primitives
- `lucide-react@^0.552.0`: Icon library
- `motion@^12.23.24`: Animation library
- `next@16.0.1`, `react@19.2.0`: Framework versions

## Common Patterns
- Use `ChatStatus` type for loading states: `'idle' | 'streaming' | 'submitted'`
- Model selection uses objects: `{ name: 'GPT 4o', value: 'openai/gpt-4o' }`
- Web search forces GPT-4o model when enabled
- Sources are extracted from message parts with `type: 'source-url'`

## Testing Approach
Focus on component integration tests rather than unit tests for individual chat components, as they're designed to work together as a system.