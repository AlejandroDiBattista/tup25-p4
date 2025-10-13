// Módulo para probar la API de Gemini desde Vite
// IMPORTANTE: Definí tu API Key en un archivo `.env` en la raíz del proyecto:
// VITE_GEMINI_API_KEY="TU_API_KEY_RESTRINGIDA"
// Nunca subas la key real a GitHub.

const MODEL_ID = "gemini-2.5-flash";

function getApiKey() {
  const key = import.meta?.env?.VITE_GEMINI_API_KEY;
  if (!key) {
    throw new Error("Falta VITE_GEMINI_API_KEY en el entorno (.env)");
  }
  return key;
}

async function generarRespuesta(prompt) {
  const GEMINI_API_KEY = getApiKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }]}],
    // Podés ajustar parámetros de generación acá.
    generationConfig: { temperature: 0.7 },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Error HTTP ${res.status} ${res.statusText}: ${detail}`);
  }

  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts ?? [])
    .map(p => p.text || "")
    .join("");
  return text.trim();
}

// UI
async function onEnviar(e) {
  e.preventDefault();
  const input = document.getElementById("prompt");
  const salida = document.getElementById("salida");
  const btn = document.getElementById("btn-enviar");
  const prompt = (input.value || "").trim();
  if (!prompt) {
    salida.textContent = "Ingresá un prompt";
    return;
  }
  btn.disabled = true;
  salida.textContent = "Generando...";
  try {
    const respuesta = await generarRespuesta(prompt);
    salida.textContent = respuesta || "(Sin texto)";
  } catch (err) {
    console.error(err);
    salida.textContent = "Error: " + err.message;
  } finally {
    btn.disabled = false;
  }
}

function init() {
  const form = document.getElementById("form-gemini");
  if (form) form.addEventListener("submit", onEnviar);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

export { generarRespuesta }; // opcional para pruebas