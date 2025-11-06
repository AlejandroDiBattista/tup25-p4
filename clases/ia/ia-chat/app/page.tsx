'use client';

import { useState, Fragment } from 'react';
import { useChat } from '@ai-sdk/react';
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import type { UIMessage } from 'ai';

// Componentes auxiliares locales que simplifican la construcción del chat
import { ChatContainer, ChatMessages, ChatMessage, ChatReasoning, ChatSources, ChatInput, ChatLoader, type MessagePart, } from './components';

// Modelos disponibles para el chat
const models = [
  { name: 'GPT 5 Mini', value: 'openai/gpt-5-mini' },
  { name: 'GPT 5', value: 'openai/gpt-5' },
  { name: 'GPT 4o', value: 'openai/gpt-4o' },
  { name: 'GPT 4.1', value: 'openai/gpt-4.1' },
];

/**
 * ChatBotDemo - Aplicación de chat principal
 * 
 * Este componente construye un chat de IA usando componentes auxiliares simples:
 * 1. ChatContainer: estructura y layout
 * 2. ChatMessages: contenedor de mensajes con scroll
 * 3. ChatMessage/ChatReasoning/ChatSources: tipos de contenido
 * 4. ChatInput: entrada del usuario con opciones
 */
const ChatBotDemo = () => {
  // Estado del chat
  const [input, setInput] = useState('');
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  
  // Hook de chat de AI SDK
  const { messages, sendMessage, status, regenerate } = useChat();

  // Maneja el envío de mensajes
  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) return;

    sendMessage(
      { text: message.text || 'Sent with attachments', files: message.files as any, },
      { body: { model, webSearch }, }
    );
    setInput('');
  };

  // Funciones auxiliares
  const handleCopy = (text: string) => { navigator.clipboard.writeText(text); };

  return (
    <ChatContainer>
      {/* Lista de mensajes */}
      <ChatMessages>
        {messages.map((message: UIMessage) => {
          const messageData = message as UIMessage & {
            parts?: MessagePart[];
            content?: string;
          };

          // Normaliza las partes del mensaje
          const parts: MessagePart[] = Array.isArray(messageData.parts)
            ? messageData.parts
            : typeof messageData.content === 'string'
            ? [{ type: 'text', text: messageData.content }]
            : [];

          // Extrae fuentes si existen
          const sources = parts
            .filter((part) => part.type === 'source-url')
            .map((part) => ({ url: part.url, title: part.url }));

          const isLastMessage = message.id === messages.at(-1)?.id;

          return (
            <div key={message.id}>
              {/* Muestra fuentes si es asistente y hay fuentes */}
              {message.role === 'assistant' && sources.length > 0 && ( <ChatSources sources={sources} /> )}

              {/* Renderiza cada parte del mensaje */}
              {parts.map((part, i) => {
                const isLastPart = i === parts.length - 1;
                const isStreaming = status === 'streaming' && isLastPart && isLastMessage;

                switch (part.type) {
                  case 'text':
                    return (
                      <Fragment key={`${message.id}-${i}`}>
                        <ChatMessage
                          role={message.role as 'user' | 'assistant'}
                          content={part.text ?? ''}
                          isLastMessage={isLastPart && isLastMessage}
                          onRegenerate={regenerate}
                          onCopy={handleCopy}
                        />
                      </Fragment>
                    );

                  case 'reasoning':
                    return (
                      <ChatReasoning
                        key={`${message.id}-${i}`}
                        content={part.text ?? ''}
                        isStreaming={isStreaming}
                      />
                    );

                  default:
                    return null;
                }
              })}
            </div>
          );
        })}

        {/* Indicador de carga */}
        {status === 'submitted' && <ChatLoader />}
      </ChatMessages>

      {/* Campo de entrada */}
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
};

export default ChatBotDemo;