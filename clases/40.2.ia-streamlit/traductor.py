import streamlit as st
from openai import OpenAI

# Configurar la página
st.set_page_config(page_title="Traductor", page_icon="🌐")

# Título
st.title("🌐 Traductor Inglés ⟷ Español")

# Inicializar cliente OpenAI
client = OpenAI(api_key=st.secrets["OPENAI_API_KEY"])

# Selector de dirección de traducción
direccion = st.radio(
    "Dirección de traducción:",
    ["Español → Inglés", "Inglés → Español"],
    horizontal=True
)

# Área de texto para ingresar el texto
texto_entrada = st.text_area(
    "Texto a traducir:",
    height=150,
    placeholder="Escribe aquí el texto que deseas traducir..."
)

# Botón de traducir
if st.button("Traducir", type="primary", use_container_width=True):
    if texto_entrada.strip():
        with st.spinner("Traduciendo..."):
            try:
                # Determinar idiomas según la dirección
                if direccion == "Español → Inglés":
                    prompt = f"Traduce el siguiente texto del español al inglés:\n\n{texto_entrada}"
                else:
                    prompt = f"Traduce el siguiente texto del inglés al español:\n\n{texto_entrada}"
                
                # Llamar a la API de OpenAI
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "Eres un traductor profesional. Traduce el texto de manera precisa y natural."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3
                )
                
                # Mostrar resultado
                traduccion = response.choices[0].message.content
                st.success("✅ Traducción completada")
                st.text_area(
                    "Resultado:",
                    value=traduccion,
                    height=150,
                    disabled=True
                )
                
            except Exception as e:
                st.error(f"❌ Error: {str(e)}")
    else:
        st.warning("⚠️ Por favor ingresa un texto para traducir")

# Información adicional
with st.expander("ℹ️ Información"):
    st.markdown("""
    **Cómo usar:**
    1. Selecciona la dirección de traducción
    2. Escribe o pega el texto que deseas traducir
    3. Haz clic en "Traducir"
    
    **Nota:** La API key se carga automáticamente desde `.streamlit/secrets.toml`
    """)
