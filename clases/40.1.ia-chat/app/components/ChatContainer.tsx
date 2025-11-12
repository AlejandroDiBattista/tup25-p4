/**
 * ChatContainer - Contenedor principal del chat
 * Maneja el layout y estructura básica de la aplicación de chat
 */

import { ReactNode } from 'react';

interface ChatContainerProps {
  children: ReactNode;
}

export const ChatContainer = ({ children }: ChatContainerProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        {children}
      </div>
    </div>
  );
};
