import streamlit as st
from openai import OpenAI

client = OpenAI(api_key=st.secrets["OPENAI_API_KEY"])

modelo = "gpt-5-mini"
instruccion = """
Eres un asistente útil y creativo. Da respuestas claras y concisas. 

Usa la herramienta de búsqueda web cuando necesites datos 
recientes o verificados.

Cuando se te solicite una pregunta matemática, 
escribe y ejecuta código usando la herramienta de 
python para responder la pregunta.

Cuando uses python mostrame el código que generaste usando bloque de código ```python...
"""

def evaluar(mensajes, modelo, instrucciones, respuesta):

    parametros = {
        "model": modelo,
        "instructions": instrucciones,
        "input": mensajes,
        "tools": [
            {"type": "web_search"},
            {"type": "code_interpreter", "container": {"type": "auto"}}
        ]
    }

    with client.responses.stream( **parametros ) as stream:
        for evento in stream:
            if evento.type == "response.output_text.delta":
                respuesta["fragmentos"].append(evento.delta)
                yield evento.delta
            elif evento.type == "response.completed":
                break
        
        if final := stream.get_final_response():
            respuesta["texto"] = final.output_text
        else:
            respuesta["texto"] = "".join(respuesta["fragmentos"])


s = st.session_state
# Inicializar el historial de chat en session_state
if "messages" not in s:
    s.messages = []

# Configuración en la barra lateral
with st.sidebar:
    st.title("Configuración")
    modelo      = st.selectbox("Selecciona el modelo:", ["gpt-5", "gpt-5-mini", "gpt-5-nano"], index=1)
    instruccion = st.text_area("Instrucciones del asistente:", instruccion.strip(), height="content")
    if st.button("Reiniciar chat"):
        s.messages = []
        
st.title(f"Charla fluida con :rainbow[{modelo.upper()}]")
    
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
            respuesta = {"texto": "", "fragmentos": []}
            st.write_stream( evaluar(s.messages, modelo, instruccion, respuesta) )
            s.messages.append({"role": "assistant", "content": respuesta["texto"]})
        
    # Forzar re-ejecución para mostrar los mensajes actualizados
    st.rerun()
