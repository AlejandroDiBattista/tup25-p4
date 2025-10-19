import matplotlib.pyplot as plt
import pandas as pd
import streamlit as st

st.set_page_config(page_title="Reporte de productos", layout="wide")

# Sidebar
st.sidebar.title("Configuración")
uploaded_file = st.sidebar.file_uploader("Seleccioná un CSV", type="csv")
selected_year = st.sidebar.selectbox("Seleccioná un año", [])

st.write("Escribir aca la solucion del TP5")