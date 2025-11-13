import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt


st.set_page_config(page_title="Reporte de productos", layout="wide")

st.sidebar.title("Configuración")
uploaded = st.sidebar.file_uploader("Seleccioná un CSV", type=["csv"])

if uploaded is None:
    st.info("Subí un archivo CSV desde la barra lateral para comenzar.")
    st.stop()

try:
    df = pd.read_csv(uploaded)
except Exception as e:
    st.error(f"Error leyendo el CSV: {e}")
    st.stop()

# Normalizar nombres de columnas
df.columns = [c.strip() for c in df.columns]
if 'ano' in df.columns and 'año' not in df.columns:
    df = df.rename(columns={'ano': 'año'})

required = ['año', 'mes', 'producto', 'cantidad', 'ingreso', 'costo']
if not all(col in df.columns for col in required):
    st.error("El CSV debe contener las columnas: año, mes, producto, cantidad, ingreso, costo")
    st.stop()

# Convertir tipos
df['año'] = pd.to_numeric(df['año'], errors='coerce')
df['mes'] = pd.to_numeric(df['mes'], errors='coerce')
df['cantidad'] = pd.to_numeric(df['cantidad'], errors='coerce').fillna(0)
df['ingreso'] = pd.to_numeric(df['ingreso'], errors='coerce').fillna(0)
df['costo'] = pd.to_numeric(df['costo'], errors='coerce').fillna(0)

# Filtrar años disponibles y selector
years = sorted(df['año'].dropna().unique().astype(int).tolist())
if not years:
    st.warning("El año seleccionado no tiene datos para mostrar.")
    st.stop()

selected_year = st.sidebar.selectbox("Seleccioná un año", options=years)

# Filtrar por año
df_year = df[df['año'] == int(selected_year)]
if df_year.empty:
    st.warning("El año seleccionado no tiene datos para mostrar.")
    st.stop()

# Encabezado principal
st.title("Informe de Productos 📈")
st.caption("Métricas resumidas y evolución de precios/costos por año y mes.")

# Visualización por producto
products = sorted(df_year['producto'].dropna().unique())
for product in products:
    prod_df = df_year[df_year['producto'] == product].copy()
    total_qty = prod_df['cantidad'].sum()
    total_ing = prod_df['ingreso'].sum()
    total_cost = prod_df['costo'].sum()

    avg_price = (total_ing / total_qty) if total_qty != 0 else 0
    avg_cost = (total_cost / total_qty) if total_qty != 0 else 0

    # Contenedor con borde
    st.markdown("<div style='border:1px solid #ddd;padding:12px;margin-bottom:12px;border-radius:6px;'>", unsafe_allow_html=True)

    # Título del producto (formato pedido)
    st.markdown(f"## :red[{product}]")

    left_col, right_col = st.columns([0.3, 0.7])

    with left_col:
        st.write("**Cantidad de ventas:**", f"{int(total_qty):,}")
        st.write("**Precio promedio:**", f"{avg_price:.2f}")
        st.write("**Costo promedio:**", f"{avg_cost:.2f}")

    with right_col:
        # Cálculo mensual: sumar ingreso/costo y cantidad por mes y luego dividir
        monthly = prod_df.groupby('mes').agg({'ingreso': 'sum', 'costo': 'sum', 'cantidad': 'sum'}).reset_index()
        monthly = monthly.sort_values('mes')
        # Evitar división por cero
        monthly['precio_prom'] = monthly.apply(lambda r: (r['ingreso'] / r['cantidad']) if r['cantidad'] != 0 else 0, axis=1)
        monthly['costo_prom'] = monthly.apply(lambda r: (r['costo'] / r['cantidad']) if r['cantidad'] != 0 else 0, axis=1)

        fig, ax = plt.subplots(figsize=(8, 3))
        ax.plot(monthly['mes'], monthly['precio_prom'], marker='o', color='#1f77b4', label='Precio promedio')
        ax.plot(monthly['mes'], monthly['costo_prom'], marker='o', color='#d62728', label='Costo promedio')
        ax.set_xlabel('Mes')
        ax.set_ylabel('Monto')
        ax.set_title('Evolución de precio y costo promedio')
        ax.grid(linestyle='--', alpha=0.3)
        ax.legend(loc='best')
        st.pyplot(fig)

    st.markdown("</div>", unsafe_allow_html=True)