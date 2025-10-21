import streamlit as st
from supabase import create_client, Client
from typing import Optional, List, Dict

ss = st.session_state

# Configuración de Supabase
SUPABASE_URL = "https://lfxccyaqhukkfrmqrcuq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmeGNjeWFxaHVra2ZybXFyY3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMzY2NDcsImV4cCI6MjA3NDkxMjY0N30.qrQuq-YORAU9iezCItIQumFdTwQLPF3PZxXWSqQEUsI"

# Clase DAO (Data Access Object) para gestionar contactos
class ContactoDAO:
    """Clase para gestionar operaciones CRUD de contactos en Supabase"""
    
    _supabase: Client = None
    _tabla = "contactos"
    
    @classmethod
    def _get_client(cls) -> Client:
        """Inicializa y retorna el cliente de Supabase (singleton)"""
        if cls._supabase is None:
            cls._supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        return cls._supabase
    
    @classmethod
    def listar(cls) -> List[Dict]:
        """Obtiene todos los contactos ordenados por id"""
        try:
            response = cls._get_client().table(cls._tabla).select("*").order("id").execute()
            return response.data
        except Exception as e:
            st.error(f"Error al cargar contactos: {e}")
            return []
    
    @classmethod
    def obtener(cls, id: int) -> Optional[Dict]:
        """Obtiene un contacto por su id"""
        try:
            response = cls._get_client().table(cls._tabla).select("*").eq("id", id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            st.error(f"Error al obtener contacto: {e}")
            return None
    
    @classmethod
    def crear(cls, dato: Dict) -> bool:
        """Crea un nuevo contacto"""
        try:
            cls._get_client().table(cls._tabla).insert(**dato).execute()
            return True
        except Exception as e:
            st.error(f"Error al crear contacto: {e}")
            return False
    
    @classmethod
    def actualizar(cls, id: int, dato: Dict) -> bool:
        """Actualiza un contacto existente"""
        try:
            cls._get_client().table(cls._tabla).update(**dato).eq("id", id).execute()
            return True
        except Exception as e:
            st.error(f"Error al actualizar contacto: {e}")
            return False
    
    @classmethod
    def eliminar(cls, id: int) -> bool:
        """Elimina un contacto por su id"""
        try:
            cls._get_client().table(cls._tabla).delete().eq("id", id).execute()
            return True
        except Exception as e:
            st.error(f"Error al eliminar contacto: {e}")
            return False
    
    @classmethod
    def guardar(cls, dato: Dict) -> bool:
        """Guarda un contacto (crea o actualiza según tenga id)"""
        if "id" in dato and dato["id"]:
            return cls.actualizar(dato["id"], dato)
        else:
            return cls.crear(dato)
    
modo   = ss.setdefault("modo", "listar")
actual = ss.setdefault("actual", None)

def poner_modo(modo, id=None):
    ss["modo"]   = modo
    ss["actual"] = id
    st.rerun()


def editar_contacto(id):
    # Cargar contacto desde la base de datos si estamos editando
    contacto = None
    if id is not None:
        contacto = ContactoDAO.obtener(id)
    
    with st.form("form_editar"):
        nombre = st.text_input("Nombre", value=contacto["nombre"] if contacto else "")
        edad   = st.number_input("Edad", min_value=0, max_value=120, step=1, value=contacto["edad"] if contacto else 0)
        ciudad = st.text_input("Ciudad", value=contacto["ciudad"] if contacto else "")

        _, aceptar, cancelar = st.columns([4,1,1])
        if aceptar.form_submit_button("Guardar"):
            # Preparar datos del contacto
            datos_contacto = { "nombre": nombre, "edad": int(edad), "ciudad": ciudad }
            
            if id is not None:
                datos_contacto["id"] = id
                mensaje = "Contacto actualizado"
            else:
                mensaje = "Contacto agregado"
            
            if ContactoDAO.guardar(datos_contacto):
                st.success(mensaje)
                poner_modo("listar")

        if cancelar.form_submit_button("Cancelar"):
            poner_modo("listar")

def listar_agenda():
    # Cargar contactos desde Supabase usando DAO
    contactos = ContactoDAO.listar()
    
    if not contactos:
        st.info("No hay contactos. Agrega uno nuevo.")
        return
    
    for contacto in contactos:
        with st.container(border=True):
            datos, acciones = st.columns([4,1])
            with datos:
                st.subheader(contacto["nombre"])
                st.write(f"Edad: {contacto['edad']}")
                st.write(f"Ciudad: {contacto['ciudad']}")
            with acciones:
                if st.button("Editar", key=f"editar_{contacto['id']}"):
                    poner_modo("editar", contacto["id"])
                if st.button("Eliminar", key=f"eliminar_{contacto['id']}"):
                    if ContactoDAO.eliminar(contacto["id"]):
                        st.success("Contacto eliminado")
                        st.rerun()

st.title("Agenda de Contactos")
if st.button("Agregar Contacto"):
    poner_modo("agregar")
    
match modo:
    case "agregar":
        st.subheader("Nuevo Contacto")
        editar_contacto(None)
    case "editar":
        st.subheader("Editar Contacto")
        editar_contacto(actual)
    case "listar":
        listar_agenda()