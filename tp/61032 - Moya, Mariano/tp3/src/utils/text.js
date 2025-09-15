// Utilidades de texto
export function norm(str) {
	return str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export function cmpNombre(a, b) {
	return norm(a.nombre).localeCompare(norm(b.nombre));
}

export function includesContacto(a, texto) {
	if (!texto) return true;
	const t = norm(texto);
	return [a.nombre, a.telefono, a.legajo].some(campo => norm(campo).includes(t));
}
