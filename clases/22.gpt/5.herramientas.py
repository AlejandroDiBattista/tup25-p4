import json
from typing import Any, Dict, List

import streamlit as st
from openai import OpenAI


def calculadora(expresion: str) -> str:
    """Evalúa expresiones aritméticas simples de forma segura."""
    print(f">> Calculando expresión: {expresion}")
    try:
        resultado = eval(expresion)
    except Exception as exc:
        return f"Error en calculadora: {exc}"
    return str(resultado)


client = OpenAI(api_key=st.secrets["OPENAI_API_KEY"])

MODEL_OPTIONS = ["gpt-5", "gpt-5-mini", "gpt-5-nano"]
DEFAULT_MODEL = "gpt-5-mini"

DEFAULT_INSTRUCTIONS = """
Eres un asistente útil y creativo. Da respuestas claras y concisas.
Cuando el usuario solicite cálculos aritméticos o exprese operaciones matemáticas,
usa la herramienta `calculadora` para obtener el resultado antes de responder.
"""

TOOLS = [
    {
        "type": "function",
        "name": "calculadora",
        "description": "Evalúa expresiones aritméticas simples",
        "parameters": {
            "type": "object",
            "properties": {
                "expresion": {
                    "type": "string",
                    "description": "La expresión aritmética a evaluar",
                }
            },
            "required": ["expresion"],
        },
    }
]


def inicializar_estado(s: st.session_state) -> None:
    if "chat_history" not in s:
        s.chat_history: List[Dict[str, str]] = []
    if "modelo" not in s:
        s.modelo = DEFAULT_MODEL
    if "instruccion" not in s:
        s.instruccion = DEFAULT_INSTRUCTIONS.strip()


def construir_input(
    historial: List[Dict[str, str]], instrucciones: str
) -> List[Dict[str, Any]]:
    """Adapta historial + instrucciones al formato `input` de la Responses API."""
    mensajes: List[Dict[str, Any]] = []
    instrucciones_limpias = instrucciones.strip()
    if instrucciones_limpias:
        mensajes.append(
            {
                "role": "system",
                "content": [
                    {
                        "type": "input_text",
                        "text": instrucciones_limpias,
                    }
                ],
            }
        )
    for mensaje in historial:
        rol = mensaje["role"]
        tipo = "input_text" if rol == "user" else "output_text"
        mensajes.append(
            {
                "role": rol,
                "content": [
                    {
                        "type": tipo,
                        "text": mensaje["content"],
                    }
                ],
            }
        )
    return mensajes


def _tool_calls_from_required_action(response):
    action = getattr(response, "required_action", None)
    submit = getattr(action, "submit_tool_outputs", None) if action else None
    if not submit:
        return []
    calls = []
    for tool_call in submit.tool_calls:
        nombre = tool_call.function.name
        argumentos = tool_call.function.arguments
        call_id = getattr(tool_call, "id", None) or getattr(tool_call.function, "call_id", None)
        calls.append(
            {
                "id": tool_call.id,
                "call_id": call_id or tool_call.id,
                "name": nombre,
                "arguments": argumentos,
            }
        )
    return calls


def _tool_calls_from_output(response):
    calls = []
    for item in getattr(response, "output", []):
        item_type = getattr(item, "type", None)
        if item_type != "function_call":
            continue
        function_call = getattr(item, "function_call", None)
        nombre = None
        argumentos = None
        call_id = getattr(item, "call_id", None)
        if function_call:
            nombre = getattr(function_call, "name", None)
            argumentos = getattr(function_call, "arguments", None)
            call_id = getattr(function_call, "id", None) or getattr(function_call, "call_id", None)
        else:
            nombre = getattr(item, "name", None)
            argumentos = getattr(item, "arguments", None)
            call_id = getattr(item, "id", None)
        output_id = getattr(item, "id", None)
        if nombre and argumentos and call_id:
            calls.append(
                {
                    "id": output_id or call_id,
                    "call_id": call_id,
                    "name": nombre,
                    "arguments": argumentos,
                }
            )
    return calls


def resolver_tool_calls(response, model):
    procesados = set()
    while True:
        tool_calls = _tool_calls_from_required_action(response)
        if not tool_calls:
            tool_calls = _tool_calls_from_output(response)
        tool_calls = [call for call in tool_calls if call["call_id"] not in procesados]
        if not tool_calls:
            break
        salidas = []
        for call in tool_calls:
            argumentos_raw = call["arguments"] or "{}"
            if isinstance(argumentos_raw, str):
                argumentos = json.loads(argumentos_raw or "{}")
            else:
                argumentos = argumentos_raw
            nombre = call["name"]
            st.caption(f"🔧 Llamado a `{nombre}` con {argumentos}")
            print(f"TOOL CALL -> {nombre} {argumentos}")
            if nombre == "calculadora":
                resultado = calculadora(**argumentos)
            else:
                resultado = f"Herramienta no implementada: {nombre}"
            st.caption(f"↳ Resultado: {resultado}")
            print(f"TOOL RESULT -> {resultado}")
            salidas.append(
                {"call_id": call["call_id"], "output": resultado}
            )
            procesados.add(call["call_id"])
        response = client.responses.create(
            model=model,
            previous_response_id=response.id,
            input=[{**salida, "type": "function_call_output"} for salida in salidas],
            tools=TOOLS,
        )
        st.caption(f"📡 Estado tras herramienta: {response.status}")
    return response


def extraer_texto_response(response) -> str:
    texto_directo = getattr(response, "output_text", None)
    if texto_directo:
        return texto_directo.strip()
    textos: List[str] = []
    for item in getattr(response, "output", []):
        item_type = getattr(item, "type", None)
        if item_type == "message":
            for contenido in getattr(item, "content", []):
                contenido_tipo = getattr(contenido, "type", None)
                if contenido_tipo in {"output_text", "text"}:
                    textos.append(contenido.text)
        elif item_type == "text":
            texto = getattr(item, "text", None)
            if texto:
                textos.append(texto)
    texto_final = "\n".join([t for t in textos if t]).strip()
    return texto_final


def mostrar_debug(response) -> None:
    with st.expander("Detalles de la respuesta", expanded=False):
        try:
            st.json(response.model_dump())
        except AttributeError:
            st.write(response)


def main() -> None:
    s = st.session_state
    inicializar_estado(s)

    with st.sidebar:
        st.title("Configuración")
        modelo_idx = MODEL_OPTIONS.index(s.modelo)
        modelo = st.selectbox("Selecciona el modelo:", MODEL_OPTIONS, index=modelo_idx)
        instruccion = st.text_area(
            "Instrucciones del asistente:",
            value=s.instruccion,
            height=200,
        )
        if st.button("Reiniciar chat"):
            s.chat_history = []
        s.modelo = modelo
        s.instruccion = instruccion.strip()

    st.title(f"Charla con :rainbow[{s.modelo.upper()}]")

    for mensaje in s.chat_history:
        st.chat_message(mensaje["role"]).markdown(mensaje["content"])

    if prompt := st.chat_input("Escribe tu mensaje..."):
        st.chat_message("user").markdown(prompt)
        s.chat_history.append({"role": "user", "content": prompt})

        mensajes_api = construir_input(s.chat_history, s.instruccion)

        with st.chat_message("assistant"):
            with st.spinner("Pensando..."):
                try:
                    response = client.responses.create(
                        model=s.modelo,
                        input=mensajes_api,
                        tools=TOOLS,
                    )
                    st.caption(f"📡 Estado inicial: {response.status}")
                except Exception as exc:
                    st.error(f"Error llamando al modelo: {exc}")
                    print(f"ERROR Responses.create -> {exc}")
                    return

                response = resolver_tool_calls(response, s.modelo)

                if getattr(response, "status", None) != "completed":
                    st.warning(f"Estado final inesperado: {response.status}")
                    print(f"Estado final inesperado -> {response.status}")

                texto_asistente = extraer_texto_response(response)
                if not texto_asistente:
                    texto_asistente = "_El modelo no devolvió texto legible._"
                st.markdown(texto_asistente)
                mostrar_debug(response)

        s.chat_history.append({"role": "assistant", "content": texto_asistente})


if __name__ == "__main__":
    main()
