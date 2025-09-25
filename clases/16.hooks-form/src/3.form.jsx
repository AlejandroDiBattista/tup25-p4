import React from 'react'; 
import { useForm } from 'react-hook-form';

export default function FormEdicion({ datos, onAceptar, onCancelar, leyenda = 'Editar datos' }) {

    const { register, handleSubmit } = useForm({
        defaultValues: datos,
    });

    function manejarCancelar(e) {
        e.preventDefault();
        onCancelar?.();
    }

    function Input({ label, name, type = 'text' }) {
        return (
            <label>
                {label}
                <input type={type} {...register(name)} />   
            </label>
        )
    }

    return (
        <form onSubmit={ handleSubmit(onAceptar) }>
            <legend>{leyenda}</legend>

            <Input label="Nombre"   name="nombre" />
            <Input label="Apellido" name="apellido" />
            <Input label="Teléfono" name="telefono" type="tel" />
            
            <fieldset>
                <button type="submit">Aceptar</button>
                <button type="button" onClick={manejarCancelar}>Cancelar</button>
            </fieldset>
        </form>
    )
}
