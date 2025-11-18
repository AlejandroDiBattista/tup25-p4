#!/bin/zsh
# Script de conveniencia para preparar el entorno y lanzar la app Streamlit.

# Sale si ya existe el virtualenv
if [[ ! -d ".venv" ]]; then
  python3 -m venv .venv
fi

source .venv/bin/activate

pip install --upgrade pip
pip install .

streamlit run streamlit_app.py