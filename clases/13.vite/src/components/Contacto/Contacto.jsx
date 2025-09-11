import './Contacto.css'

export function Contacto({nombre, telefono, legajo, comision, alSaludar}){
    function alSaludarInterno(){
        if(alSaludar){
            alSaludar(nombre, telefono)
        }
    }
    return (
        <div 
            className="card-contacto"
            onClick={alSaludarInterno}>
            <h2>{nombre}</h2>
            <p>Telefono: {telefono}</p> 
            <b>Legajo: {legajo} en {comision}</b>
        </div>
    )
}


