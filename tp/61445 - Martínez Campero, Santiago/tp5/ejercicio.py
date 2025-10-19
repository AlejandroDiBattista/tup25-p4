import matplotlib.pyplot as plt
import pandas as pd
import streamlit as st

st.set_page_config(page_title="Reporte de productos", layout="wide")

# Barra lateral
st.sidebar.title("Configuración")
uploaded_file = st.sidebar.file_uploader("Seleccioná un CSV", type="csv")

# Leer el CSV y obtener años disponibles
if uploaded_file is not None:
    df = pd.read_csv(uploaded_file)
    años_disponibles = sorted(df['año'].unique())
else:
    años_disponibles = []

selected_year = st.sidebar.selectbox("Seleccioná un año", años_disponibles)

# Validaciones
if uploaded_file is None:
    st.info("Subí un archivo CSV desde la barra lateral para comenzar.")
    st.stop()

# Filtrar datos por año seleccionado
df_filtrado = df[df['año'] == selected_year]

if df_filtrado.empty:
    st.warning("El año seleccionado no tiene datos para mostrar.")
    st.stop()

st.write("Escribir aca la solucion del TP5")