import base64
import mimetypes
import os
from pathlib import Path

from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

def procesar_imagen(origen: str, destino: str, prompt: str = "") -> bool:
    """Procesa una imagen con la API de Google GenAI y guarda el resultado."""
    origen_path, destino_path = Path(origen).resolve(), Path(destino).resolve()
    
    if not origen_path.exists() or destino_path.exists():
        return False

    if not prompt:
        prompt = (
            "Genera una foto de perfil profesional tipo carnet: iluminación de estudio, "
            "fondo neutro gris claro, rostro centrado (60-70%), busto completo, "
            "preservar detalles faciales, sin auriculares, formato cuadrado 1:1."
        )

    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=os.environ.get("GEMINI_API_KEY"))
        
        mime_type  = mimetypes.guess_type(origen_path.name)[0] or "image/jpeg"
        image_data = base64.b64encode(origen_path.read_bytes()).decode("utf-8")
        
        message = HumanMessage(content=[
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{image_data}"}}
        ])

        response = llm.invoke([message], generation_config={"response_modalities": ["IMAGE"]})
        
        # Extract image from response (assuming first part is the image)
        # The structure is typically response.content[0]["image_url"]["url"] but simplified parsing:
        for part in response.content:
            if isinstance(part, dict) and (url := part.get("image_url", {}).get("url")):
                destino_path.write_bytes(base64.b64decode(url.split(",")[-1]))
                return True

    except Exception as e:
        print(f"Error: {e}")

    return False
