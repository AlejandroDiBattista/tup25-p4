// Utilidad mínima para hablar con la API pública de Gemini
// Requiere definir VITE_GEMINI_API_KEY en .env (local)

const MODEL_ID = 'gemini-2.5-flash';

function getApiKey() {
  // Permite override con localStorage (útil en demos)
  const ls = typeof window !== 'undefined' ? window.localStorage?.getItem('gemini_key') : null;
  const env = import.meta?.env?.VITE_GEMINI_API_KEY;
  const key = (ls || env || '').trim();
  if (!key) throw new Error('Falta API key: VITE_GEMINI_API_KEY o localStorage.gemini_key');
  return key;
}

function toContents(messages) {
  return (messages || []).map(m => ({
    role: m.role === 'model' ? 'model' : 'user',
    parts: [{ text: String(m.text ?? '') }],
  }));
}

export async function generateChat(messages) {
  const apiKey = getApiKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    contents: toContents(messages),
    generationConfig: {
      temperature: 0.6,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${detail}`);
  }
  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts ?? [])
    .map(p => p.text || '')
    .join('')
    .trim();
  return text || '(sin respuesta)';
}

