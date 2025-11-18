"""Aplicación Streamlit para traducir textos del inglés al español."""

from __future__ import annotations

import os
from typing import Optional

import streamlit as st
from openai import OpenAI
from openai.error import OpenAIError

DEFAULT_MODEL = "gpt-4.1-mini"
PROMPT_TEMPLATE = (
    "Traduce al español el siguiente texto en inglés manteniendo el tono y el significado:"
    "\n\nTexto:\n{text}"
)


def load_api_key() -> Optional[str]:
    """Intenta obtener la clave de OpenAI desde secrets primero y luego desde el entorno."""

    for key in ("OPENAI_API_KEY", "openai_api_key"):
        if (value := st.secrets.get(key)):
            return value

    return os.environ.get("OPENAI_API_KEY")


def translate_text(text: str, api_key: str) -> str:
    """Solicita a la API de OpenAI la traducción del texto proporcionado."""

    client = OpenAI(api_key=api_key)
    response = client.responses.create(
        model=DEFAULT_MODEL,
        input=PROMPT_TEMPLATE.format(text=text.strip()),
        temperature=0.3,
    )

    output = response.output
    if not output:
        return ""

    content = output[0].content
    if not content:
        return ""

    return str(content[0].get("text", "")).strip()


def render_ui() -> None:
    """Construye la interfaz Streamlit y maneja interacciones del usuario."""

    st.set_page_config(page_title="Traductor Inglés → Español", layout="centered")
    st.title("Traductor de inglés a español con OpenAI")

    st.write(
        "Escribe un fragmento en inglés y pulsa el botón para obtener una traducción fiel en español. "
        "La aplicación usa la API de respuesta de OpenAI, así que asegúrate de tener tu clave lista."
    )

    api_key = load_api_key()
    if not api_key:
        st.warning(
            "No se encontró `OPENAI_API_KEY`. Colócala en `st.secrets` o en la variable de entorno y vuelve a cargar."
        )

    if "last_translation" not in st.session_state:
        st.session_state.last_translation = ""

    with st.form("translator_form"):
        english_text = st.text_area(
            "Texto en inglés",
            height=220,
            placeholder="Enter the text you want to translate...",
            key="english_input",
        )
        submit = st.form_submit_button("Traducir ahora")

    if submit:
        if not english_text.strip():
            st.warning("Escribe primero el texto en inglés que quieres traducir.")
        elif not api_key:
            st.error("No se puede traducir sin una clave de OpenAI.")
        else:
            with st.spinner("Traduciendo con OpenAI..."):
                try:
                    translation = translate_text(english_text, api_key)
                except OpenAIError as exc:
                    st.error(f"OpenAI devolvió un error: {exc}")
                else:
                    if translation:
                        st.session_state.last_translation = translation
                    else:
                        st.info("No se recibió texto traducido. Intenta con otro fragmento.")

    if st.session_state.last_translation:
        st.subheader("Traducción al español")
        st.text_area("", st.session_state.last_translation, height=200)


def main() -> None:
    render_ui()


if __name__ == "__main__":
    main()