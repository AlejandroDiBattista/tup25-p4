/**
 * ChatInput - Componente de entrada de mensajes
 * Maneja la entrada de texto, archivos adjuntos y configuraciones
 */

import { 
  PromptInput, 
  PromptInputHeader, 
  PromptInputAttachments, 
  PromptInputAttachment, 
  PromptInputBody, 
  PromptInputTextarea, 
  PromptInputFooter, 
  PromptInputTools, 
  PromptInputActionMenu, 
  PromptInputActionMenuTrigger, 
  PromptInputActionMenuContent, 
  PromptInputActionAddAttachments, 
  PromptInputButton, 
  PromptInputModelSelect, 
  PromptInputModelSelectTrigger, 
  PromptInputModelSelectValue, 
  PromptInputModelSelectContent, 
  PromptInputModelSelectItem, 
  PromptInputSubmit,
  type PromptInputMessage 
} from '@/components/ai-elements/prompt-input';
import { GlobeIcon } from 'lucide-react';
import { ChatStatus } from './types';

interface Model {
  name: string;
  value: string;
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: PromptInputMessage) => void;
  status: ChatStatus;
  
  // Configuración de modelo
  selectedModel: string;
  onModelChange: (model: string) => void;
  availableModels: Model[];
  
  // Búsqueda web
  webSearchEnabled: boolean;
  onWebSearchToggle: () => void;
}

export const ChatInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  status,
  selectedModel,
  onModelChange,
  availableModels,
  webSearchEnabled,
  onWebSearchToggle
}: ChatInputProps) => {
  return (
    <PromptInput onSubmit={onSubmit} className="mt-4" globalDrop multiple>
      {/* Header: Archivos adjuntos */}
      <PromptInputHeader>
        <PromptInputAttachments>
          {(attachment) => <PromptInputAttachment data={attachment} />}
        </PromptInputAttachments>
      </PromptInputHeader>

      {/* Body: Área de texto */}
      <PromptInputBody>
        <PromptInputTextarea 
          onChange={(e) => onChange(e.target.value)} 
          value={value} 
        />
      </PromptInputBody>

      {/* Footer: Herramientas y botón de envío */}
      <PromptInputFooter>
        <PromptInputTools>
          {/* Menú de adjuntos */}
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>

          {/* Búsqueda web */}
          <PromptInputButton 
            variant={webSearchEnabled ? 'default' : 'ghost'} 
            onClick={onWebSearchToggle}
          >
            <GlobeIcon size={16} />
            <span>Search</span>
          </PromptInputButton>

          {/* Selector de modelo */}
          <PromptInputModelSelect 
            onValueChange={onModelChange} 
            value={selectedModel}
          >
            <PromptInputModelSelectTrigger>
              <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
              {availableModels.map((model) => (
                <PromptInputModelSelectItem key={model.value} value={model.value}>
                  {model.name}
                </PromptInputModelSelectItem>
              ))}
            </PromptInputModelSelectContent>
          </PromptInputModelSelect>
        </PromptInputTools>

        {/* Botón de envío */}
        <PromptInputSubmit disabled={!value && !status} status={status} />
      </PromptInputFooter>
    </PromptInput>
  );
};
