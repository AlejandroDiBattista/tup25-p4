import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

# -------------------------------
# 1. Configuración de la página
# -------------------------------
st.set_page_config(
    page_title="Reporte de productos",
    layout="wide"
)

# -------------------------------
# 2. Barra lateral
# -------------------------------
st.sidebar.title("Configuración")

# Selector de archivo CSV
uploaded_file = st.sidebar.file_uploader(
    "Seleccioná un CSV",
    type=["csv"]
)

# Inicializar variable de DataFrame
df = None

# Si se cargó un archivo, leerlo
if uploaded_file:
    df = pd.read_csv(uploaded_file)

# Selector de año
if df is not None:
    available_years = sorted(df['año'].unique())
    selected_year = st.sidebar.selectbox("Seleccioná un año", available_years)
else:
    selected_year = None

# -------------------------------
# 3. Validaciones
# -------------------------------
if df is None:
    st.info("Subí un archivo CSV desde la barra lateral para comenzar.")
    st.stop()

# Filtrar por año seleccionado
df_year = df[df['año'] == selected_year]

if df_year.empty:
    st.warning("El año seleccionado no tiene datos para mostrar.")
    st.stop()

# -------------------------------
# 4. Encabezado principal
# -------------------------------
st.title("Informe de Productos 📈")
st.caption("Métricas resumidas y evolución de precios/costos por año y mes.")

# -------------------------------
# 5. Visualización por Producto
# -------------------------------
# Ordenar productos alfabéticamente
products = sorted(df_year['producto'].unique())

for product in products:
    product_data = df_year[df_year['producto'] == product].copy()
    
    # Calcular métricas
    total_quantity = product_data['cantidad'].sum()
    product_data['precio_promedio'] = product_data['ingreso'] / product_data['cantidad']
    product_data['costo_promedio'] = product_data['costo'] / product_data['cantidad']
    avg_price = product_data['precio_promedio'].mean()
    avg_cost = product_data['costo_promedio'].mean()
    
    # Contenedor con borde
    with st.container():
        st.markdown(f"## :red[{product}]")
        col1, col2 = st.columns([0.3, 0.7])
        
        # Columna de métricas
        with col1:
            st.markdown(f"**Cantidad de ventas:** {total_quantity:,}")
            st.markdown(f"**Precio promedio:** {avg_price:.2f}")
            st.markdown(f"**Costo promedio:** {avg_cost:.2f}")
        
        # Columna de gráfico
        with col2:
            # Agrupar por mes
            monthly = product_data.groupby('mes').agg({
                'precio_promedio': 'mean',
                'costo_promedio': 'mean'
            }).reset_index().sort_values('mes')
            
            fig, ax = plt.subplots(figsize=(8, 3))
            ax.plot(
                monthly['mes'], monthly['precio_promedio'], 
                marker='o', color='#1f77b4', label='Precio promedio'
            )
            ax.plot(
                monthly['mes'], monthly['costo_promedio'], 
                marker='o', color='#d62728', label='Costo promedio'
            )
            ax.set_xlabel("Mes")
            ax.set_ylabel("Monto")
            ax.set_title("Evolución de precio y costo promedio")
            ax.legend(loc='best')
            ax.grid(True, linestyle='--', alpha=0.3)
            
            st.pyplot(fig)
