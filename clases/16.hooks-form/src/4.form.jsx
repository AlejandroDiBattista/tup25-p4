import React from 'react'; 
import { useForm } from 'react-hook-form';

export default function FormEdicion({ datos, onAceptar, onCancelar, leyenda = 'Editar datos' }) {

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: datos,
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    function manejarCancelar(e) {
        e.preventDefault();
        onCancelar?.();
    }

    function Input({ label, name, type = 'text', reglas = {} }) {
        const error = errors?.[name]
        return (
            <label>
                {label}
                <input
                    {...register(name, reglas)}
                    type={type}
                    aria-invalid={!!error}
                />
                {error && (
                    <div role="alert" id={`err-${name}`} style={{ color: 'crimson', fontSize: 14 }}>
                        {error.message || 'Campo inválido'}
                    </div>
                )}
            </label>
        )
    }

    return (
        <form onSubmit={handleSubmit(onAceptar)}>
            <legend>{leyenda}</legend>
            <hr />
            <Input label="Nombre"   name="nombre"   reglas={{ required: 'El nombre es obligatorio.' }} />
            <Input label="Apellido" name="apellido" reglas={{ required: 'El apellido es obligatorio.' }} />
            <Input label="Teléfono" name="telefono" type="tel" reglas={{ required: 'El teléfono es obligatorio.', minLength: { value: 7, message: 'El teléfono debe tener al menos 7 dígitos.' } }} />
            
            <fieldset>
                <button type="submit">Aceptar</button>
                <button type="button" onClick={manejarCancelar}>Cancelar</button>
            </fieldset>
        </form>
    )
}
