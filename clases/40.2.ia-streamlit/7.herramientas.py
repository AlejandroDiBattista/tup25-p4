# 5.herramientas.py
from __future__ import annotations

import ast
import operator as op
from dataclasses import dataclass, field
from typing import Any, Dict, List, Tuple

import streamlit as st
from openai import OpenAI

# ---------- Config ----------
DEFAULT_MODEL = "gpt-4o-mini"  # cámbialo si quieres

# ---------- Utilidades de cálculo (sin eval) ----------
# Permitimos solo operaciones aritméticas simples
_ALLOWED_OPS = {
    ast.Add: op.add,
    ast.Sub: op.sub,
    ast.Mult: op.mul,
    ast.Div: op.truediv,
    ast.FloorDiv: op.floordiv,
    ast.Mod: op.mod,
    ast.Pow: op.pow,
    ast.USub: op.neg,
    ast.UAdd: op.pos,
}

def _eval_ast(node: ast.AST) -> float:
    if isinstance(node, ast.Num):               # 123, 3.14
        return node.n  # type: ignore[attr-defined]
    if isinstance(node, ast.UnaryOp) and type(node.op) in _ALLOWED_OPS:
        return _ALLOWED_OPS[type(node.op)](_eval_ast(node.operand))
    if isinstance(node, ast.BinOp) and type(node.op) in _ALLOWED_OPS:
        return _ALLOWED_OPS[type(node.op)](_eval_ast(node.left), _eval_ast(node.right))
    raise ValueError("Expresión no permitida")

def calcular_seguro(expresion: str) -> str:
    try:
        tree = ast.parse(expresion, mode="eval")
        res = _eval_ast(tree.body)  # type: ignore[arg-type]
        return str(res)
    except Exception as e:
        return f"Error en calculadora: {e}"

# ---------- Definición del tool para Responses API ----------
def build_tools() -> List[Dict[str, Any]]:
    """
    Esquema de tools para Responses API.
    """
    return [
        {
            "type": "function",
            "name": "calculadora",
            "description": "Evalúa una expresión aritmética simple y devuelve el resultado.",
            "parameters": {
                "type": "object",
                "properties": {
                    "expresion": {
                        "type": "string",
                        "description": "Expresión aritmética, ej: '123*321' o '(2+3)/5'",
                    }
                },
                "required": ["expresion"],
                "additionalProperties": False,
            },
        }
    ]

# ---------- Estructuras de mensajes para Responses API ----------
def system_msg(instructions: str) -> Dict[str, Any]:
    return {
        "role": "system",
        "content": [{"type": "input_text", "text": instructions.strip()}],
    }

def user_msg(text: str) -> Dict[str, Any]:
    return {"role": "user", "content": [{"type": "input_text", "text": text}]}

def assistant_msg(text: str) -> Dict[str, Any]:
    return {"role": "assistant", "content": [{"type": "output_text", "text": text}]}

def tool_msg(tool_call_id: str, text: str) -> Dict[str, Any]:
    # MUY IMPORTANTE: role "tool" + tool_call_id (Responses/Function calling)
    # No existe client.responses.submit_tool_outputs en Responses API
    return {
        "role": "tool",
        "tool_call_id": tool_call_id,
        "content": [{"type": "output_text", "text": text}],
    }

# ---------- Extracción de tool calls ----------
def extract_tool_calls(response) -> List[Tuple[str, str, Dict[str, Any]]]:
    """
    Devuelve lista de (tool_call_id, nombre, argumentos)
    Puede venir en response.output (items type=="tool_call").
    """
    calls: List[Tuple[str, str, Dict[str, Any]]] = []
    output = getattr(response, "output", None) or []
    for item in output:
        if getattr(item, "type", None) != "tool_call":
            continue
        # En SDK nuevo, item contiene .id .name .arguments (dict o str)
        call_id = getattr(item, "id", None)
        name = getattr(item, "name", None)
        args = getattr(item, "arguments", None)
        if isinstance(args, str):
            # el SDK a veces entrega JSON string
            import json
            try:
                args = json.loads(args)
            except Exception:
                args = {"__raw": args}
        if call_id and name and isinstance(args, dict):
            calls.append((call_id, name, args))
    return calls

# ---------- Bucle de tool calling para Responses API ----------
def run_with_tools(client: OpenAI, model: str, messages: List[Dict[str, Any]], tools: List[Dict[str, Any]]):
    """
    1) Llama a responses.create
    2) Si hay tool_calls, ejecuta y añade mensajes role=='tool'
    3) Repite hasta que no existan tool_calls
    """
    response = client.responses.create(model=model, input=messages, tools=tools, )

    # Bucle de resolución de herramientas
    vistos = set()
    while True:
        tool_calls = [c for c in extract_tool_calls(response) if c[0] not in vistos]
        if not tool_calls:
            break

        for call_id, name, args in tool_calls:
            vistos.add(call_id)
            if name == "calculadora":
                salida = calcular_seguro(args.get("expresion", ""))
            else:
                salida = f"Herramienta desconocida: {name}"
            messages.append(tool_msg(call_id, salida))

        # IMPORTANTE: en Responses, volvemos a crear otro response con los mensajes + tool outputs
        response = client.responses.create(model=model, input=messages, tools=tools)

    return response

# ---------- UI ----------
@dataclass
class AppState:
    chat: List[Dict[str, str]] = field(default_factory=list)
    instrucciones: str = (
        "Eres un asistente breve y directo. Si necesitas calcular algo, usa la herramienta."
    )
    modelo: str = DEFAULT_MODEL

def init_state() -> AppState:
    if "app_state" not in st.session_state:
        st.session_state.app_state = AppState()
    return st.session_state.app_state

def main():
    st.set_page_config(page_title="Charla con GPT (Responses + Tools)", page_icon="🛠️")
    st.title("Charla con GPT (Responses API + Tools)")
    st.caption("Demostración de llamadas a herramientas sin submit_tool_outputs.")

    s = init_state()
    client = OpenAI()

    # Sidebar
    with st.sidebar:
        st.subheader("Configuración")
        s.modelo = st.text_input("Modelo", value=s.modelo)
        s.instrucciones = st.text_area("Instrucciones (system)", value=s.instrucciones, height=120)
        if st.button("Borrar chat"):
            s.chat.clear()
            st.rerun()

    # Historial visible
    for m in s.chat:
        with st.chat_message(m["role"]):
            st.markdown(m["content"])

    # Entrada
    prompt = st.chat_input("Escribe algo… (p. ej. 'cuanto es 123*321')")
    if not prompt:
        return

    s.chat.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Preparar mensajes y tools
    tools = build_tools()
    messages: List[Dict[str, Any]] = [system_msg(s.instrucciones)]
    for m in s.chat:
        if m["role"] == "user":
            messages.append(user_msg(m["content"]))
        else:
            messages.append(assistant_msg(m["content"]))

    with st.chat_message("assistant"):
        with st.spinner("Pensando…"):
            try:
                response = run_with_tools(client, s.modelo, messages, tools)
            except Exception as e:
                st.error(f"Error llamando al modelo: {e}")
                return

            # Texto final
            texto = getattr(response, "output_text", "") or "_El modelo no devolvió texto._"
            st.markdown(texto)
            s.chat.append({"role": "assistant", "content": texto})

if __name__ == "__main__":
    main()
