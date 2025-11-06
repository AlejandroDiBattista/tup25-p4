/**
 * ChatReasoning - Componente para mostrar el razonamiento del asistente
 * Muestra el proceso de pensamiento de la IA de forma colapsable
 */

import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai-elements/reasoning';

interface ChatReasoningProps {
  content: string;
  isStreaming?: boolean;
}

export const ChatReasoning = ({ content, isStreaming = false }: ChatReasoningProps) => {
  return (
    <Reasoning className="w-full" isStreaming={isStreaming}>
      <ReasoningTrigger />
      <ReasoningContent>{content}</ReasoningContent>
    </Reasoning>
  );
};
