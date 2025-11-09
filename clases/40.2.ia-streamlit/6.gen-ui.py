import streamlit as st
from openai import OpenAI
import io
import json 
import contextlib

st.set_page_config(page_title="Generador dinámico de interfaces", layout="wide")
st.title("🧠 Generador de Interfaz Dinámica con GPT-5")

# --- Sidebar: configuración ---
model = st.sidebar.selectbox("Modelo", ["gpt-5", "gpt-5-mini", "gpt-4o-mini"])
max_output_tokens = st.sidebar.number_input("Max tokens", 256, 4096, 2048)
st.sidebar.caption("💡 Se recomienda al menos 2048 tokens para generar código completo")

# --- Entrada ---
prompt = st.text_area("🧩 Descripción de la interfaz a generar", height=150,
                      placeholder="Ejemplo: Crear un formulario con nombre, email y botón de enviar")

if st.button("🎨 Generar interfaz"):
    client = OpenAI(api_key=st.secrets["OPENAI_API_KEY"])

    with st.spinner("Generando código con GPT-5..."):
        try:
            response = client.responses.create(
                model=model,
                instructions="Genera código Python de Streamlit, dentro de una función llamada render_ui(). Solo devuelve el código Python limpio, sin bloques markdown ni explicaciones.",
                input=[ {"role": "user", "content": prompt}, ],
                max_output_tokens=max_output_tokens,
            )
        except Exception as e:
            st.error(f"❌ Error al llamar a la API: {e}")
            st.stop()

        # Verificar si la respuesta está incompleta
        if hasattr(response, 'status') and response.status == "incomplete":
            razon = getattr(response, 'incomplete_details', None)
            st.warning(f"⚠️ Respuesta incompleta: {razon}")
            st.info("💡 Aumenta el límite de tokens (max_output_tokens) o simplifica tu solicitud")
        
        # Extraer el texto de la respuesta usando model_dump para acceder a toda la estructura
        code = ""
        
        try:
            # Convertir la respuesta a diccionario para acceso más fácil
            if hasattr(response, 'model_dump'):
                dump = response.model_dump()
                
                # El texto puede estar en varios lugares según el tipo de respuesta
                # 1. En output como lista de items
                print(f"DEBUG: Procesando item de output: {json.dumps(dump, indent=2)}")
                if 'output' in dump and dump['output']:
                    for item in dump['output']:
                        if 'summary' in item and isinstance(item['summary'], list):
                            print("# Caso A: Item de tipo reasoning con summary como lista")
                            for summary_item in item['summary']:
                                if isinstance(summary_item, str):
                                    code += summary_item + "\n"
                        # Caso B: Item con content como lista
                        elif 'content' in item and isinstance(item['content'], list):
                            print("# Caso B: Item con content como lista")
                            for content_item in item['content']:
                                if isinstance(content_item, dict) and 'text' in content_item:
                                    code += content_item['text'] + "\n"
                        # Caso C: Summary directo como string
                        elif 'summary' in item and isinstance(item['summary'], str):
                            print("# Caso C: Item con summary como string")
                            code += item['summary'] + "\n"
                
                code = code.strip()
        except Exception as e:
            st.caption(f"Debug: Error extrayendo con model_dump: {e}")
        
        if not code:
            st.error("❌ No se pudo extraer el código de la respuesta")
            st.info("🔍 Revisa los detalles de debug abajo para entender la estructura")
            with st.expander("Ver respuesta completa para debug"):
                st.write(response)
                if hasattr(response, 'model_dump'):
                    st.json(response.model_dump())
            st.stop()

    st.subheader("🧾 Código generado")
    st.code(code, language="python")

    # --- Panel para mostrar la UI generada ---
    st.subheader("🧪 Resultado en vivo")
    container = st.container()

    # Redefinimos un espacio aislado para ejecutar
    sandbox = {"st": st}
    with contextlib.redirect_stdout(io.StringIO()):
        try:
            exec(code, sandbox)
            if "render_ui" in sandbox:
                with container:
                    sandbox["render_ui"]()
            else:
                st.warning("⚠️ No se encontró la función `render_ui()` en el código generado.")
        except Exception as e:
            st.error(f"❌ Error ejecutando el código: {e}")

