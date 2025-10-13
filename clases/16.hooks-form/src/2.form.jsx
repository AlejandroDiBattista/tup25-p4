import React from 'react'; 

export default function FormEdicion({datos,  onAceptar,  onCancelar, leyenda = 'Editar datos' }) {
    
    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const datos = {
            nombre:   form.nombre.value,
            apellido: form.apellido.value,
            telefono: form.telefono.value,
        };
        if( validar(datos))
            onAceptar?.(datos);
    }

    function manejarCancelar(e) {
        e.preventDefault();
        onCancelar?.();
    }
    
    function Input({ label, name, type = 'text' }) {
        return (
            <label>
                {label}
                <input name={name} type={type} defaultValue={datos[name]} required />
            </label>
        )
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
			<legend>{leyenda}</legend>

            <Input label="Nombre"   name="nombre" />
            <Input label="Apellido" name="apellido" />
            <Input label="Teléfono" name="telefono" type="tel" />
            
            <fieldset>
                <button type="submit">Aceptar</button>
                <button type="button" onClick={manejarCancelar}>Cancelar</button>
            </fieldset>
        </form>
        </>
    )
}