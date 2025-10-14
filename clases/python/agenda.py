# app.py
import json
import os
import re
import streamlit as st # type: ignore

DATA_FILE = "contactos.json"

# ---------------------------
# Modelos de dominio
# ---------------------------

class Contacto:
    def __init__(self, nombre="", apellido="", telefono="", email="", id=0):
        self.id = id
        self.nombre = nombre
        self.apellido = apellido
        self.telefono = telefono
        self.email = email

    @classmethod
    def from_dict(cls, data):
        return cls(
            nombre=data.get("nombre", "").strip(),
            apellido=data.get("apellido", "").strip(),
            telefono=data.get("telefono", "").strip(),
            email=data.get("email", "").strip(),
            id=data.get("id", 0),
        )
        
    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "telefono": self.telefono,
            "email": self.email,
        }

    def includes(self, term):
        term = term.lower()
        return any(filter(lambda x: term in x, [self.nombre, self.apellido, self.telefono, self.email]))

    def validate(self):
        EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
        PHONE_RE = re.compile(r"^[0-9+\-()\s]{6,}$")
        
        errs = []
        if not self.nombre.strip():
            errs.append("El nombre es obligatorio.")
        if not self.apellido.strip():
            errs.append("El apellido es obligatorio.")
        if self.email and not EMAIL_RE.match(self.email.strip()):
            errs.append("El email no parece válido.")
        if self.telefono and not PHONE_RE.match(self.telefono.strip()):
            errs.append("El teléfono no parece válido.")
        return errs


class Agenda:
    def __init__(self, data_file):
        self.data_file = data_file
        self.contactos = []
        self.load()
        self.proximo_id = 1

    def load(self):
        if not os.path.exists(self.data_file):
            self.contactos = []
            return
        try:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            self.contactos = []
            return

        if isinstance(data, list):
            self.contactos = [Contacto.from_dict(item) for item in data]
        else:
            self.contactos = []
        self.proximo_id = max(c.id for c in self.contactos) + 1

    def save(self):
        with open(self.data_file, "w", encoding="utf-8") as f:
            json.dump([c.to_dict() for c in self.contactos], f, ensure_ascii=False, indent=2)

    def add(self, contacto):
        if not contacto.id:
            contacto.id = self.proximo_id
            self.proximo_id += 1

        self.contactos.append(contacto)
        self.save()

    def get(self, id):
        for contacto in self.contactos:
            if contacto.id == id:
                return contacto
        return None

    def update(self, contacto):
        for idx, existente in enumerate(self.contactos):
            if existente.id == contacto.id:
                self.contactos[idx] = contacto
                self.save()
                return True
        return False

    def delete(self, id):
        for idx, contacto in enumerate(self.contactos):
            if contacto.id == id:
                del self.contactos[idx]
                self.save()
                return True
        return False

    def filter(self, query):
        term = query.strip().lower()
        if not term:
            return list(self.contactos)
        return [c for c in self.contactos if c.includes(term)]

# ---------------------------
# Validaciones
# ---------------------------

def contact_form(form_key, contacto, *, primary_label="Guardar"):

    with st.form(form_key, clear_on_submit=True):
        nombre   = st.text_input("Nombre", value=contacto.nombre)
        apellido = st.text_input("Apellido", value=contacto.apellido)
        telefono = st.text_input("Teléfono", value=contacto.telefono)
        email    = st.text_input("Email", value=contacto.email)

    botones = st.columns(4)
    submit = botones[-2].form_submit_button(primary_label)
    cancel = botones[-1].form_submit_button("Cancelar", type="secondary")

    valores = {
        "nombre": nombre.strip(),
        "apellido": apellido.strip(),
        "telefono": telefono.strip(),
        "email": email.strip(),
        "contacto_id": contacto.id,
    }

    return valores if submit else None


@st.dialog("➕ Agregar contacto")
def add_contact_dialog():
    """Dialogo para cargar un nuevo contacto."""
    agenda = st.session_state.agenda
    resultado = contact_form( "add_form", contacto=Contacto(), primary_label="Agregar" )

    if resultado:
        contacto = Contacto(**resultado)
        if errs := contacto.validate():
            st.error("\n".join(errs))
        else:
            agenda.add(contacto)
            st.success("Contacto agregado.")
            st.session_state.show_add_form = False
            st.rerun()

    st.rerun()


@st.dialog("✏️ Editar contacto")
def edit_contact_dialog(contacto_id):
    """Dialogo para editar un contacto existente."""
    agenda = st.session_state.agenda
    current = agenda.get(contacto_id)
    if current is None:
        st.session_state.editing_contact_id = None
        st.warning("No se encontró el contacto solicitado.")
        return
    
    if resultado := contact_form( "edit_form", contacto=current, primary_label="Guardar"):
        contacto = Contacto(**resultado)
        if errs := contacto.validate():
            st.error("\n".join(errs))
        else:
            agenda.update(contacto)
            st.session_state.editing_contact_id = None
            st.success("Contacto actualizado.")
            st.rerun()
        st.rerun()

# ---------------------------
# Estado
# ---------------------------
if "agenda" not in st.session_state:
    st.session_state.agenda = Agenda(DATA_FILE)
if "editing_index" in st.session_state:
    # Compatibilidad con sesiones anteriores
    st.session_state.editing_index = None
if "editing_contact_id" not in st.session_state:
    st.session_state.editing_contact_id = None
if "show_add_form" not in st.session_state:
    st.session_state.show_add_form = False

st.set_page_config(page_title="Agenda de Contactos", page_icon="📒", layout="wide")
st.title("📒 Agenda de Contactos")
agenda = st.session_state.agenda

# ---------------------------
# Buscador y acción principal
# ---------------------------
top_left, top_right = st.columns([4, 1])
with top_left:
    busqueda = st.text_input("🔎 Buscar (por nombre, apellido, teléfono o email)")

with top_right:
    if not st.session_state.show_add_form:
        if st.button("➕ Agregar contacto", key="open_add", use_container_width=True):
            st.session_state.show_add_form = True
            st.session_state.editing_contact_id = None

if st.session_state.show_add_form:
    add_contact_dialog()

filtered = agenda.filter(busqueda)
total_contactos = len(agenda.contactos)
st.caption(f"Mostrando {len(filtered)} de {total_contactos} contacto(s).")

# Encabezados
cols = st.columns([2, 2, 2, 3, 1, 1])
cols[0].markdown("**Nombre**")
cols[1].markdown("**Apellido**")
cols[2].markdown("**Teléfono**")
cols[3].markdown("**Email**")
cols[4].markdown("**Editar**")
cols[5].markdown("**Borrar**")

for contacto in filtered:
    ccols = st.columns([2, 2, 2, 3, 1, 1])
    ccols[0].write(contacto.nombre)
    ccols[1].write(contacto.apellido)
    ccols[2].write(contacto.telefono)
    ccols[3].write(contacto.email)

    edit_key = f"edit_{contacto.id}"
    delete_key = f"delete_{contacto.id}"

    if ccols[4].button("✏️", key=edit_key):
        st.session_state.editing_contact_id = contacto.id
        # Si se entra en edición, cerrar formulario de agregar
        st.session_state.show_add_form = False

    if ccols[5].button("🗑️", key=delete_key):
        agenda.delete(contacto.id)
        if st.session_state.editing_contact_id == contacto.id:
            st.session_state.editing_contact_id = None
        st.success("Contacto borrado.")
        st.rerun()

contacto_id = st.session_state.editing_contact_id
if contacto_id is not None:
    edit_contact_dialog(contacto_id)