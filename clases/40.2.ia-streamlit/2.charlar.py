import streamlit as st
from openai import OpenAI

client = OpenAI(api_key=st.secrets["OPENAI_API_KEY"])

modelo      = "gpt-5-mini"
instruccion = "Eres un asistente útil y creativo."

s = st.session_state

with st.sidebar:
    st.title("Configuración")
    modelo = st.selectbox("Selecciona el modelo:", ["gpt-5", "gpt-5-mini", "gpt-5-nano"], index=1)
    instruccion = st.text_area("Instrucciones del asistente:", instruccion)
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
    with st.chat_message("user"):
        st.markdown(prompt)
    # Obtener respuesta del asistente con spinner
    with st.spinner("Pensando..."):
        response = client.responses.create( 
                        model=modelo, 
                        instructions=instruccion, 
                        input=s.messages)
        respuesta = response.output_text
        s.messages.append({"role": "assistant", "content": respuesta})
    
    # Forzar re-ejecución para mostrar los mensajes actualizados
    st.rerun()
