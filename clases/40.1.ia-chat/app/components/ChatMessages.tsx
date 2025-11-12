/**
 * ChatMessages - Contenedor de mensajes del chat
 * Renderiza todos los mensajes de la conversación con scroll automático
 */

import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { ReactNode } from 'react';

interface ChatMessagesProps {
  children: ReactNode;
}

export const ChatMessages = ({ children }: ChatMessagesProps) => {
  return (
    <Conversation className="h-full">
      <ConversationContent>
        {children}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};
