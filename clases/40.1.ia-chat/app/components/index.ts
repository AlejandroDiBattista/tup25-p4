/**
 * Componentes auxiliares del chat
 * 
 * Este módulo exporta componentes que simplifican la construcción del chat:
 * 
 * - ChatContainer: Contenedor principal con layout responsive
 * - ChatMessages: Lista de mensajes con scroll automático
 * - ChatMessage: Mensaje individual con acciones
 * - ChatReasoning: Proceso de pensamiento de la IA
 * - ChatSources: Fuentes de información consultadas
 * - ChatInput: Campo de entrada con todas las opciones
 * - ChatLoader: Indicador de carga
 */

export { ChatContainer } from './ChatContainer';
export { ChatMessages } from './ChatMessages';
export { ChatMessage } from './ChatMessage';
export { ChatReasoning } from './ChatReasoning';
export { ChatSources } from './ChatSources';
export { ChatInput } from './ChatInput';
export { ChatLoader } from './ChatLoader';
export type { ChatStatus, MessageRole, MessagePart, ChatMessageData, Model } from './types';
