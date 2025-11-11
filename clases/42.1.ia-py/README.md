Instrucciones rápidas

1) Crea y activa un entorno virtual (recomendado):

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2) Instala dependencias:

```bash
python3 -m pip install --upgrade pip
pip install -r requirements.txt
```

3) Ejecuta la app Streamlit:

```bash
streamlit run 2.charlar-pdf.py
```

Si obtienes errores como "ModuleNotFoundError: No module named 'langchain.text_splitter'", asegúrate de haber instalado las dependencias en el entorno activo (paso 1 y 2).  

