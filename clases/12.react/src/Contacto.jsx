import "./Contacto.css"

function Contacto({ nombre, telefono, email, alMarcar }) {
    function handleClick() {
        alMarcar(nombre, telefono, 1);
    }
    return (
        <div 
            className="card-contacto" 
            onClick={handleClick}>
            <h2>{nombre}</h2>
            <p>Teléfono: {telefono}</p>
        <p>Email: {email}</p>
    </div>
)
}

export default Contacto