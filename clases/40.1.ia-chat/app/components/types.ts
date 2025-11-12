/**
 * Tipos compartidos para los componentes del chat
 */

import type { ChatStatus as AIChatStatus } from 'ai';

export type ChatStatus = AIChatStatus;

export type MessageRole = 'user' | 'assistant';

export interface MessagePart {
  type: string;
  text?: string;
  url?: string;
  [key: string]: unknown;
}

export interface ChatMessageData {
  id: string;
  role: MessageRole;
  parts?: MessagePart[];
  content?: string;
}

export interface Model {
  name: string;
  value: string;
}
