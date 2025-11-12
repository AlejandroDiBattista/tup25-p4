/**
 * ChatMessage - Componente individual de mensaje
 * Renderiza un mensaje con su contenido y acciones disponibles
 */

import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import { Actions, Action } from '@/components/ai-elements/actions';
import { RefreshCcwIcon, CopyIcon } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isLastMessage?: boolean;
  onRegenerate?: () => void;
  onCopy?: (text: string) => void;
}

export const ChatMessage = ({ role, content, isLastMessage = false, onRegenerate, onCopy }: ChatMessageProps) => {
  const showActions = role === 'assistant' && isLastMessage;

  return (
    <>
      <Message from={role}>
        <MessageContent>
          <Response>{content}</Response>
        </MessageContent>
      </Message>
      
      {showActions && (
        <Actions className="mt-2">
          {onRegenerate && (
            <Action onClick={onRegenerate} label="Retry">
              <RefreshCcwIcon className="size-3" />
            </Action>
          )}
          {onCopy && (
            <Action onClick={() => onCopy(content)} label="Copy">
              <CopyIcon className="size-3" />
            </Action>
          )}
        </Actions>
      )}
    </>
  );
};
