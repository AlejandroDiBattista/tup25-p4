import streamlit as st
import tempfile
import os

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain

# ---------------- CONFIG ----------------
st.set_page_config(page_title="📘 Chat con tu PDF", page_icon="🧠")
st.title("🧠 Chat con tu PDF")

# Obtener API key desde secrets
try:
    api_key = st.secrets["OPENAI_API_KEY"]
except (KeyError, FileNotFoundError):
    st.error("⚠️ No se encontró la API key. Por favor, configura OPENAI_API_KEY en los secrets.", icon="🔑")
    st.stop()

# Estado de sesión
if "messages" not in st.session_state:
    st.session_state.messages = []

if "retrieval_chain" not in st.session_state:
    st.session_state.retrieval_chain = None


def reset_chat_state() -> None:
    """Elimina el historial y la cadena de recuperación almacenada."""
    st.session_state.messages = []
    st.session_state.retrieval_chain = None


def append_chat_message(role: str, content: str, *, display: bool = True) -> None:
    """Muestra y guarda un mensaje en el historial del chat."""
    if display:
        with st.chat_message(role):
            st.markdown(content)

    st.session_state.messages.append({"role": role, "content": content})


def parse_chat_submission(submission):
    """Devuelve el texto y la lista de archivos adjuntos de una entrada de chat."""
    if not submission:
        return "", []

    if isinstance(submission, str):
        return submission.strip(), []

    text_value = getattr(submission, "text", "") or ""
    files_value = getattr(submission, "files", []) or []

    if isinstance(submission, dict):
        text_value = submission.get("text", text_value) or ""
        files_value = submission.get("files", files_value) or []

    if isinstance(files_value, (list, tuple)):
        files = [file for file in files_value if file is not None]
    elif files_value:
        files = [files_value]
    else:
        files = []

    return text_value.strip(), files


def build_retrieval_chain_from_pdf(uploaded_file, api_key: str):
    """Crea y devuelve una cadena de recuperación a partir de un PDF subido."""
    if hasattr(uploaded_file, "seek"):
        uploaded_file.seek(0)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(uploaded_file.read())
        pdf_path = tmp_file.name

    try:
        loader = PyPDFLoader(pdf_path)
        docs = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = splitter.split_documents(docs)

        embeddings = OpenAIEmbeddings(api_key=api_key)
        vectorstore = Chroma.from_documents(splits, embedding=embeddings)
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3, api_key=api_key)

        system_prompt = (
            "Eres un asistente experto que responde basándose solo en el documento. "
            "Si algo no está en el texto, responde: 'No encontré esa información en el documento.'\n\n"
            "Contexto del documento:\n{context}"
        )

        prompt_template = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}")
        ])

        document_chain = create_stuff_documents_chain(llm, prompt_template)
        return create_retrieval_chain(retriever, document_chain)
    finally:
        try:
            os.remove(pdf_path)
        except OSError:
            pass

# Mostrar historial
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# Entrada del chat con soporte para adjuntar PDF
chat_submission = st.chat_input(
    "💬 Escribe tu pregunta sobre el PDF o adjunta un archivo...",
    accept_file=True,
    file_type=["pdf"],
)

if chat_submission:
    user_text, attached_files = parse_chat_submission(chat_submission)

    if attached_files:
        uploaded_file = attached_files[0]

        reset_chat_state()
        append_chat_message("user", f"📎 Adjuntaste `{uploaded_file.name}`")

        try:
            with st.chat_message("assistant"):
                with st.spinner("Procesando PDF..."):
                    st.session_state.retrieval_chain = build_retrieval_chain_from_pdf(uploaded_file, api_key)

                st.markdown("✅ ¡Listo! El archivo está procesado, puedes empezar a hacer preguntas.")

            append_chat_message(
                "assistant",
                "✅ ¡Listo! El archivo está procesado, puedes empezar a hacer preguntas.",
                display=False,
            )
        except Exception as error:
            append_chat_message(
                "assistant",
                f"❌ Ocurrió un error al procesar el PDF: {error}"
            )

    if user_text:
        append_chat_message("user", user_text)

        if st.session_state.retrieval_chain is None:
            append_chat_message("assistant", "📎 Por favor, adjunta primero un archivo PDF.")
        else:
            with st.chat_message("assistant"):
                with st.spinner("Pensando..."):
                    result = st.session_state.retrieval_chain.invoke({"input": user_text})
                    answer = result["answer"]
                    st.markdown(answer)

                    with st.expander("📄 Fragmentos utilizados"):
                        for i, doc in enumerate(result["context"]):
                            st.markdown(f"**Fragmento {i+1}:**")
                            st.write(doc.page_content[:700] + "…")
                            st.markdown("---")

            append_chat_message("assistant", answer, display=False)
