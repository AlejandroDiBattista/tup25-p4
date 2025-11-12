/**
 * ChatSources - Componente para mostrar fuentes de información
 * Renderiza las fuentes consultadas por el asistente en su respuesta
 */

import { Sources, SourcesContent, SourcesTrigger, Source } from '@/components/ai-elements/sources';

interface ChatSourcesProps {
  sources: Array<{ url?: string; title?: string }>;
}

export const ChatSources = ({ sources }: ChatSourcesProps) => {
  if (sources.length === 0) return null;

  return (
    <Sources>
      <SourcesTrigger count={sources.length} />
      {sources.map((source, index) => (
        <SourcesContent key={`source-${index}`}>
          <Source 
            href={source.url || '#'} 
            title={source.title || source.url || 'Unknown source'} 
          />
        </SourcesContent>
      ))}
    </Sources>
  );
};
