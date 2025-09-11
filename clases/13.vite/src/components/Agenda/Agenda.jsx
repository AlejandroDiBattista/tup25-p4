
import { Contacto } from '../Contacto'
import "./Agenda.css"

function alSaludar(nombre, telefono){
    alert(`Llamando a ${nombre} al ${telefono}`)
}

export function Agenda({contactos}){
    return (
        <>
            <h1>Agenda</h1>
            <ul className="agenda">
                {contactos.map(c => (
                    <li key={c.legajo}>
                        <Contacto  {...c} alSaludar={alSaludar} />
                    </li>
                ))}
            </ul>
        </>
    )
}

