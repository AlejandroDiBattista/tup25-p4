/**
 * EJEMPLO MÍNIMO - Chat en 50 líneas
 * 
 * Este ejemplo muestra lo simple que es construir un chat
 * usando los componentes auxiliares.
 */

'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import {
  ChatContainer,
  ChatMessages,
  ChatMessage,
  ChatInput,
  ChatLoader,
} from './index';

const MODELS = [
  { name: 'GPT 4o', value: 'openai/gpt-4o' },
];

export default function SimpleChatExample() {
  const [input, setInput] = useState('');
  const [model, setModel] = useState(MODELS[0].value);
  const { messages, sendMessage, status, regenerate } = useChat();

  const handleSubmit = (message: any) => {
    sendMessage({ text: message.text }, { body: { model } });
    setInput('');
  };

  return (
    <ChatContainer>
      <ChatMessages>
        {messages.map((msg: any) => {
          const content = typeof msg.content === 'string' ? msg.content : '';
          return (
            <ChatMessage
              key={msg.id}
              role={msg.role as 'user' | 'assistant'}
              content={content}
              isLastMessage={msg.id === messages.at(-1)?.id}
              onRegenerate={regenerate}
              onCopy={(text) => navigator.clipboard.writeText(text)}
            />
          );
        })}
        {status === 'submitted' && <ChatLoader />}
      </ChatMessages>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        status={status}
        selectedModel={model}
        onModelChange={setModel}
        availableModels={MODELS}
        webSearchEnabled={false}
        onWebSearchToggle={() => {}}
      />
    </ChatContainer>
  );
}
