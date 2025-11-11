import streamlit as st
from openai import OpenAI

client = OpenAI(api_key=st.secrets["OPENAI_API_KEY"])
    
modelo        = "gpt-5-mini"
instrucciones = """
    Eres un asistente util y creativo. Da respuestas claras y concisas.
"""

st.title(f"Preguntar a :rainbow[{modelo.upper()}]")

if prompt := st.chat_input("Escribe tu mensaje..."):
    # Mostrar mensaje del usuario
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Obtener respuesta del asistente con spinner
    with st.chat_message("assistant"):
        with st.spinner("Pensando..."):
            response = client.responses.create(
                model=modelo,
                instructions=instrucciones,
                input=prompt,
            )
            respuesta = response.output_text

        st.markdown(respuesta)
