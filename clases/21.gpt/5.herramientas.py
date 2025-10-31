import streamlit as st
from openai import OpenAI
import json


def calculadora(expresion: str ) -> str:
    """Evalúa expresiones aritméticas simples de forma segura."""
    
    try:
        resultado = eval(expresion)
    except Exception as exc:
        return f"Error en calculadora: {exc}"
    return str(resultado)


CALCULADORA_TOOL = {
    "type": "function",
    "name": "calculadora",
    "description": "Evalúa expresiones matemáticas y retorna el resultado",
    "parameters": {
        "type": "object",
        "properties": {
            "expresion": {
                "type": "string",
                "description": "La expresión matemática a evaluar, usando notación estándar",
            }
        },
        "required": ["expresion"],
    },
}


client = OpenAI(api_key=st.secrets["OPENAI_API_KEY"])

modelo = "gpt-5-mini"
instruccion = """
Eres un asistente útil y creativo. Da respuestas claras y concisas. 

Usa la herramienta de búsqueda web cuando necesites datos recientes o verificados.

Cuando se te solicite un cálculo matemático usa la herramienta de `calculadora` para responder la pregunta.
"""

s = st.session_state

with st.sidebar:
    st.title("Configuración")
    modelo      = st.selectbox("Selecciona el modelo:", ["gpt-5", "gpt-5-mini", "gpt-5-nano"], index=1)
    instruccion = st.text_area("Instrucciones del asistente:", instruccion.strip(), height="content")
    if st.button("Reiniciar chat"):
        s.messages = []
        

st.title(f"Charla con :rainbow[{modelo.upper()}]")
    
# Inicializar el historial de chat en session_state
if "messages" not in s:
    s.messages = []

# Mostrar mensajes del historial
for message in s.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Input del usuario usando chat_input
if prompt := st.chat_input("Escribe tu mensaje..."):
    
    # Agregar mensaje del usuario al historial
    s.messages.append({"role": "user", "content": prompt})
    st.chat_message("user").markdown(prompt)
    
    # Obtener respuesta del asistente con spinner
    with st.chat_message("assistant"):
        with st.spinner("Pensando..."):
            response = client.responses.create(
                model=modelo,
                instructions=instruccion,
                input=s.messages,
                tools=[
                    {"type": "web_search"},
                    {"type": "mcp",
                        "server_label": "AgentDB",
                        "server_description": "Acceso a gestor de bases de datos AgentDB",
                        "server_url": "https://mcp.agentdb.dev/73axd9Q6Gp",
                        "require_approval": "never",
                    }
                ] 
            )
            respuesta = response.output_text
            st.markdown(respuesta)
            s.messages.append({"role": "assistant", "content": respuesta})
    
    # Forzar re-ejecución para mostrar los mensajes actualizados
    st.rerun()

