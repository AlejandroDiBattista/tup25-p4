// Servicio de datos para alumnos
export function parseVcf(vcf) {
	const tarjetas = vcf.split('BEGIN:VCARD').slice(1);
	return tarjetas.map(card => {
		const fn = card.match(/FN:(.+)/)?.[1]?.trim() || '';
		const tel = card.match(/TEL;TYPE=CELL:(.+)/)?.[1]?.trim() || '';
		const note = card.match(/NOTE:(.+)/)?.[1]?.trim() || '';
		const legajo = note.match(/Legajo:\s*(\d+)/)?.[1] || '';
		const github = note.match(/Github:\s*([\w-]+)/i)?.[1] || '';
		return {
			id: legajo,
			nombre: fn,
			telefono: tel,
			legajo,
			github,
			favorito: false
		};
	});
}

export function loadAlumnos(arr) {
	return arr.filter(a => a.id && a.nombre);
}
