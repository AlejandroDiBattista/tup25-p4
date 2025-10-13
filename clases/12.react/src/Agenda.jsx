import Contacto from './Contacto.jsx'

function Agenda({contactos}){
    function marcar(nombre, telefono,veces) {
        alert(`ACA ESTOY: Llamando a ${nombre} al ${telefono} -${veces} veces`);
    }
    
    return (
        <>
        <h1>Agenda</h1>
            <div>
                {contactos.map((contacto) => (
                    <Contacto key={contacto.id} 
                        nombre={contacto.nombre}
                        telefono={contacto.telefono}
                        email={contacto.email}
                        alMarcar={marcar}
                    />
                ))}
            </div>
        </>
    )
}

export default Agenda