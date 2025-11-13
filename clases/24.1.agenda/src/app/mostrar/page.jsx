export default function MostrarContacto() {
    const contacto = { id: 1, nombre: "Alejandro", apellido: "Alconada", telefono: "123456789" };
    return (
        <div>
            <h2>Detalles del contacto</h2>
            <p><b>Nombre:</b> {contacto.nombre} {contacto.apellido}</p>
            <p><b>Teléfono:</b> {contacto.telefono}</p>
        </div>
    );
}
