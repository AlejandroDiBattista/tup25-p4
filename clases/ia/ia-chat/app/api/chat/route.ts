import { streamText, type UIMessage, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model, webSearch, }: { messages: UIMessage[]; model: string; webSearch: boolean; } = await req.json();

  const targetModel   = webSearch ? 'openai/gpt-4o' : model;
  const isOpenAIModel = targetModel.startsWith('openai/');

  const result = streamText({
    model: openai(targetModel.replace('openai/', '')),
    messages: convertToModelMessages(messages),
    system: 'Eres un asistente útil que puede responder preguntas y ayudar con tareas',
  });

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: isOpenAIModel,
    sendReasoning: true,
  });
}