import streamlit as st
import numpy as np
import plotly.graph_objects as go
import re

# Configuración de la página
st.set_page_config(page_title="Graficador 3D", layout="wide")

st.title("📊 Graficador de Funciones 3D")

# Barra lateral para configuración
st.sidebar.header("⚙️ Configuración")

# Entrada de la función
st.sidebar.subheader("Función")
funcion_str = st.sidebar.text_input(
    "f(x, y) =",
    value="np.sin(np.sqrt(x**2 + y**2)) / np.sqrt(x**2 + y**2 + 0.1)",
    help="Usa expresiones de NumPy. Ejemplo: np.sin(x) * np.cos(y)"
)

# Extraer parámetros de la función (letras solas que no sean x, y, np)
def extraer_parametros(funcion):
    # Buscar letras individuales que no sean x, y, e, ni parte de np
    tokens = re.findall(r'\b[a-z]\b', funcion.lower())
    parametros = set(tokens) - {'x', 'y', 'e'}
    return sorted(list(parametros))

parametros = extraer_parametros(funcion_str)

# Configuración de rangos
st.sidebar.subheader("Rangos de X e Y")
col1, col2 = st.sidebar.columns(2)

with col1:
    x_min = st.number_input("X mín", value=-5.0, step=0.5)
    y_min = st.number_input("Y mín", value=-5.0, step=0.5)

with col2:
    x_max = st.number_input("X máx", value=5.0, step=0.5)
    y_max = st.number_input("Y máx", value=5.0, step=0.5)

resolucion = st.sidebar.slider("Resolución", min_value=20, max_value=200, value=50, step=10)

# Configuración de parámetros
parametros_valores = {}
if parametros:
    st.sidebar.subheader("Parámetros")
    for param in parametros:
        parametros_valores[param] = st.sidebar.slider(
            f"Parámetro {param}",
            min_value=-10.0,
            max_value=10.0,
            value=1.0,
            step=0.1
        )

# Opciones de visualización
st.sidebar.subheader("Visualización")
tipo_grafico = st.sidebar.selectbox(
    "Tipo de gráfico",
    ["Superficie", "Wireframe", "Contorno 3D"]
)

colorscale = st.sidebar.selectbox(
    "Escala de colores",
    ["Viridis", "Plasma", "Inferno", "Rainbow", "Jet", "Hot", "Cool"]
)

mostrar_ejes = st.sidebar.checkbox("Mostrar ejes", value=True)

# Área principal - Gráfico
try:
    # Crear malla de puntos
    x = np.linspace(x_min, x_max, resolucion)
    y = np.linspace(y_min, y_max, resolucion)
    X, Y = np.meshgrid(x, y)
    
    # Preparar el contexto para evaluar la función
    contexto = {
        'np': np,
        'x': X,
        'y': Y,
        'sin': np.sin,
        'cos': np.cos,
        'tan': np.tan,
        'exp': np.exp,
        'log': np.log,
        'sqrt': np.sqrt,
        'abs': np.abs,
    }
    
    # Agregar parámetros al contexto
    contexto.update(parametros_valores)
    
    # Evaluar la función
    Z = eval(funcion_str, contexto)
    
    # Crear el gráfico según el tipo seleccionado
    if tipo_grafico == "Superficie":
        fig = go.Figure(data=[go.Surface(
            x=X, y=Y, z=Z,
            colorscale=colorscale.lower(),
            showscale=True
        )])
    elif tipo_grafico == "Wireframe":
        fig = go.Figure(data=[go.Surface(
            x=X, y=Y, z=Z,
            colorscale=colorscale.lower(),
            showscale=True,
            contours={
                "x": {"show": True, "width": 2},
                "y": {"show": True, "width": 2},
                "z": {"show": True, "width": 2}
            }
        )])
    else:  # Contorno 3D
        fig = go.Figure(data=[go.Surface(
            x=X, y=Y, z=Z,
            colorscale=colorscale.lower(),
            showscale=True,
            contours={
                "z": {"show": True, "usecolormap": True, "highlightcolor": "limegreen", "project": {"z": True}}
            }
        )])
    
    # Configurar el layout
    fig.update_layout(
        title=f"f(x, y) = {funcion_str}",
        scene=dict(
            xaxis=dict(title='X', visible=mostrar_ejes),
            yaxis=dict(title='Y', visible=mostrar_ejes),
            zaxis=dict(title='Z', visible=mostrar_ejes),
        ),
        autosize=True,
        height=700,
        margin=dict(l=0, r=0, b=0, t=40)
    )
    
    # Mostrar el gráfico
    st.plotly_chart(fig, use_container_width=True)
    
    # Información adicional
    with st.expander("ℹ️ Información del gráfico"):
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Z mínimo", f"{np.nanmin(Z):.4f}")
        with col2:
            st.metric("Z máximo", f"{np.nanmax(Z):.4f}")
        with col3:
            st.metric("Puntos", f"{resolucion}×{resolucion}")
        
        if parametros:
            st.write("**Parámetros actuales:**")
            for param, valor in parametros_valores.items():
                st.write(f"- {param} = {valor}")

except Exception as e:
    st.error(f"❌ Error al evaluar la función: {str(e)}")
    st.info("""
    **Consejos:**
    - Usa `np.` para funciones de NumPy (ej: `np.sin(x)`, `np.exp(y)`)
    - Las variables deben ser `x` e `y`
    - Ejemplos de funciones:
        - `np.sin(x) * np.cos(y)`
        - `x**2 + y**2`
        - `np.exp(-(x**2 + y**2)/a)`
        - `np.sin(a*x) * np.cos(b*y)`
    """)

# Ejemplos en el sidebar
with st.sidebar.expander("📚 Ejemplos de funciones"):
    st.code("np.sin(x) * np.cos(y)", language="python")
    st.code("x**2 - y**2", language="python")
    st.code("np.exp(-(x**2 + y**2))", language="python")
    st.code("np.sin(np.sqrt(x**2 + y**2))", language="python")
    st.code("a*x**2 + b*y**2 + c", language="python")
