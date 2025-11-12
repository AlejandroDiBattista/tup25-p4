import {getContactos} from '@/lib/db';
import Link from 'next/link';

const contactos = getContactos();
export default function MostrarListado(){
    return (
        <ul>
            {contactos.map((contacto) => (
                <Link href={`/mostrar/${contacto.id}`} key={contacto.id}>
                    <li>
                        <b>{contacto.nombre} {contacto.apellido}</b> - {contacto.telefono}
                    </li>
                </Link>
            ))}
        </ul>
    )
}