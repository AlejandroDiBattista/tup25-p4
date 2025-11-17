"""
Aplicación Streamlit para análisis de datos de productos.

Esta aplicación permite visualizar y analizar datos de productos a partir de archivos CSV.
Genera informes con métricas y gráficos de evolución de precios y costos.

Funcionalidades:
- Carga de archivos CSV
- Filtrado por año
- Cálculo de métricas de productos
- Visualización de evolución de precios y costos
"""

import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np


# Configuración inicial de la página
st.set_page_config(page_title="Reporte de productos", layout="wide")

st.sidebar.title("Configuración")

# Sección de carga de archivo
st.sidebar.markdown("### 📁 Carga de Datos")
uploaded = st.sidebar.file_uploader("Seleccioná un CSV", type=["csv"])

if uploaded is None:
    st.info("Subí un archivo CSV desde la barra lateral para comenzar.")
    st.stop()

try:
    df = pd.read_csv(uploaded)
except Exception as e:
    st.error(f"Error leyendo el CSV: {e}")
    st.stop()

# Validación y normalización de columnas
df.columns = [c.strip() for c in df.columns]
if 'ano' in df.columns and 'año' not in df.columns:
    df = df.rename(columns={'ano': 'año'})

required = ['año', 'mes', 'producto', 'cantidad', 'ingreso', 'costo']
if not all(col in df.columns for col in required):
    st.error("El CSV debe contener las columnas: año, mes, producto, cantidad, ingreso, costo")
    st.stop()

# Conversión de tipos de datos
df['año'] = pd.to_numeric(df['año'], errors='coerce')
df['mes'] = pd.to_numeric(df['mes'], errors='coerce')
df['cantidad'] = pd.to_numeric(df['cantidad'], errors='coerce').fillna(0)
df['ingreso'] = pd.to_numeric(df['ingreso'], errors='coerce').fillna(0)
df['costo'] = pd.to_numeric(df['costo'], errors='coerce').fillna(0)

# Filtrado de años disponibles
years = sorted(df['año'].dropna().unique().astype(int).tolist())
if not years:
    st.warning("El año seleccionado no tiene datos para mostrar.")
    st.stop()

# Selector de año en la barra lateral
st.sidebar.markdown("### 📅 Filtros")
selected_year = st.sidebar.selectbox("Seleccioná un año", options=years)

# Filtrado de datos por año seleccionado
df_year = df[df['año'] == int(selected_year)]
if df_year.empty:
    st.warning("El año seleccionado no tiene datos para mostrar.")
    st.stop()

# Encabezado principal
st.title("Informe de Productos 📈")
st.caption("Métricas resumidas y evolución de precios/costos por año y mes.")

# Información general del año seleccionado
st.markdown("---")
col1, col2, col3, col4 = st.columns(4)

with col1:
    total_ventas = df_year['cantidad'].sum()
    st.metric(label="Total de Ventas", value=f"{int(total_ventas):,}")

with col2:
    total_ingreso = df_year['ingreso'].sum()
    st.metric(label="Ingreso Total", value=f"${total_ingreso:,.2f}")

with col3:
    total_costo = df_year['costo'].sum()
    st.metric(label="Costo Total", value=f"${total_costo:,.2f}")

with col4:
    ganancia_total = total_ingreso - total_costo
    st.metric(label="Ganancia Total", value=f"${ganancia_total:,.2f}")

st.markdown("---")

# Visualización por producto
products = sorted(df_year['producto'].dropna().unique())

if not products:
    st.warning("No hay productos para mostrar en el año seleccionado.")
    st.stop()

for idx, product in enumerate(products, 1):
    prod_df = df_year[df_year['producto'] == product].copy()
    total_qty = prod_df['cantidad'].sum()
    total_ing = prod_df['ingreso'].sum()
    total_cost = prod_df['costo'].sum()

    avg_price = (total_ing / total_qty) if total_qty != 0 else 0
    avg_cost = (total_cost / total_qty) if total_qty != 0 else 0
    ganancia_producto = total_ing - total_cost

    # Contenedor con borde
    st.markdown(
        "<div style='border:2px solid #e0e0e0;padding:15px;margin-bottom:15px;border-radius:8px;background-color:#f9f9f9;'>",
        unsafe_allow_html=True
    )

    # Título del producto con número de secuencia
    st.markdown(f"## :red[{idx}. {product}]")

    left_col, right_col = st.columns([0.3, 0.7])

    # Columna izquierda: Métricas
    with left_col:
        st.write("### Métricas")
        st.write("**Cantidad de ventas:**", f"{int(total_qty):,}")
        st.write("**Precio promedio:**", f"${avg_price:.2f}")
        st.write("**Costo promedio:**", f"${avg_cost:.2f}")
        st.write("**Ganancia:**", f"${ganancia_producto:,.2f}")
        
        # Margen de ganancia
        margen = ((ganancia_producto / total_ing) * 100) if total_ing > 0 else 0
        st.write("**Margen de ganancia:**", f"{margen:.1f}%")

    # Columna derecha: Gráfico
    with right_col:
        # Cálculo mensual: sumar ingreso/costo y cantidad por mes y luego dividir
        monthly = prod_df.groupby('mes').agg({
            'ingreso': 'sum',
            'costo': 'sum',
            'cantidad': 'sum'
        }).reset_index()
        monthly = monthly.sort_values('mes')
        
        # Evitar división por cero
        monthly['precio_prom'] = monthly.apply(
            lambda r: (r['ingreso'] / r['cantidad']) if r['cantidad'] != 0 else 0,
            axis=1
        )
        monthly['costo_prom'] = monthly.apply(
            lambda r: (r['costo'] / r['cantidad']) if r['cantidad'] != 0 else 0,
            axis=1
        )

        # Crear figura con matplotlib
        fig, ax = plt.subplots(figsize=(8, 3))
        
        # Trazar líneas
        ax.plot(
            monthly['mes'],
            monthly['precio_prom'],
            marker='o',
            color='#1f77b4',
            label='Precio promedio',
            linewidth=2,
            markersize=6
        )
        ax.plot(
            monthly['mes'],
            monthly['costo_prom'],
            marker='o',
            color='#d62728',
            label='Costo promedio',
            linewidth=2,
            markersize=6
        )
        
        # Configurar ejes y etiquetas
        ax.set_xlabel('Mes', fontsize=10)
        ax.set_ylabel('Monto', fontsize=10)
        ax.set_title('Evolución de precio y costo promedio', fontsize=11, fontweight='bold')
        ax.grid(linestyle='--', alpha=0.3)
        ax.legend(loc='best', framealpha=0.9)
        
        # Ajustar layout y mostrar
        plt.tight_layout()
        st.pyplot(fig)

    st.markdown("</div>", unsafe_allow_html=True)