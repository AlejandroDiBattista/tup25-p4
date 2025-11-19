import os, mimetypes
from pathlib import Path
from google import genai
from google.genai.types import Part, ImageConfig, Content, GenerateContentConfig

def procesar_imagen(origen: str, destino: str, prompt: str = "", image_size: str = "1K") -> bool:
    origen  = Path(origen).resolve()
    destino = Path(destino).resolve()
    if not origen.exists(): return False
    
    prompt = prompt or """
            Genera una foto de perfil profesional tipo carnet con estas especificaciones:
            - Iluminación de estudio fotográfico profesional
            - Fondo neutro uniforme (gris claro)
            - Rostro centrado ocupando 60-70% del encuadre
            - Mantener cuerpo y ropa visibles (busto completo)
            - Preservar detalles faciales exactos
            - Remover auriculares si existen
            - Formato cuadrado optimizado (1:1)
            """

    mime_type = mimetypes.guess_type(origen)[0] or "image/jpeg"    
    try:
        cliente = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        respuesta = cliente.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[
                Content(
                    role="user", 
                    parts=[
                        Part.from_text(text=prompt),
                        Part.from_bytes(data=origen.read_bytes(), mime_type=mime_type)
                    ]
                )
            ],
            config=GenerateContentConfig(response_modalities=["IMAGE"], image_config=ImageConfig(image_size=image_size))
        )
        if respuesta.candidates and (data := respuesta.candidates[0].content.parts[0].inline_data.data):
            destino.write_bytes(data)   
            return True
    except: pass
    return False