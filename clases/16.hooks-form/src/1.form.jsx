import React, { useState } from 'react'

export default function FormEdicion({ datos, onAceptar, onCancelar, leyenda = 'Editar datos' }) {
	const [valores, setValores] = useState(datos)
	const [errores, setErrores] = useState({})

	const handleChange = (e) => {
		const { name, value } = e.target
		setValores((prev) => ({ ...prev, [name]: value }))
	}

	const handleBlur = (e) => {
		validar()
	}

	function validar() {
		const errores = {}

		if (!valores.nombre || valores.nombre.trim().length === 0) {
			errores.nombre = 'El nombre es obligatorio.'
		}
		if(valores.nombre.length < 2){
			errores.nombre = 'El nombre debe tener al menos 2 caracteres.'
		}
		if (!valores.apellido || valores.apellido.trim().length === 0) {
			errores.apellido = 'El apellido es obligatorio.'
		}
		if (!valores.telefono || valores.telefono.trim().length === 0) {
			errores.telefono = 'El teléfono es obligatorio.'
		}
		
		setErrores(errores)
	}

	function handleSubmit(e) {
		e.preventDefault()
		validar()
		if (Object.keys(errores).length === 0) {
			onAceptar?.(valores)
		}
	}
	const manejarCancelar = (e) => {
		e.preventDefault()
		onCancelar?.()
	}

	

	function register(name) {
		return {
			name: name,
			value: valores[name],
			onChange: handleChange,
			onBlur: handleBlur,
		}
	}

	function Input({ label, name, type = 'text' }) {
			<label>
				{label}
				<input {...register(name)} />
				{errores[name] &&
					<div style={{ color: 'crimson', fontSize: 14 }}>
						{errores[name]}
					</div>
				}
			</label>
		)
	}

	return (
		<form onSubmit={handleSubmit}>
			<legend>{leyenda}</legend>
		
			<Input label="Nombre"   name="nombre" />
			<Input label="Apellido" name="apellido" />
			<Input label="Email" name="email" type="email" />
			<Input label="Teléfono" name="telefono" type="tel" />

			<fieldset>
				<button type="submit">Aceptar</button>
				<button type="button" onClick={manejarCancelar}>Cancelar</button>
			</fieldset>
		</form>
	)
}

export { FormEdicion }
	
<form>
	<legend>{leyenda}</legend>
	<label>
		Nombre
		<input name="nombre" type="text" value={valores.nombre} 
		onChange={manejarCambioNombre}
		 />
	</label>
	<label>
		Apellido
		<input name="apellido" type="text" value={valores.apellido} 
		onChange={manejarCambioApellido} />
	</label>
	<label>
		Teléfono
		<input name="telefono" type="tel" value={valores.telefono} required />
	</label>
	<fieldset>
		<button type="submit">Aceptar</button>
		<button type="button" onClick={manejarCancelar}>Cancelar</button>
	</fieldset>
</form>