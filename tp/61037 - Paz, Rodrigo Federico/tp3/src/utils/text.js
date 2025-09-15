// utilidades de texto: normalizar sin acentos y en minúsculas
export function norm(str = '') {
  return String(str)
    .normalize('NFD')               // separa letras y marcas
    .replace(/[\u0300-\u036f]/g, '')// quita las marcas (acentos)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

// comparar por nombre normalizado (devuelve -1,0,1)
export function cmpNombre(a, b) {
  const na = norm(a.nombre)
  const nb = norm(b.nombre)
  return na.localeCompare(nb, 'es')
}

// incluir búsqueda sobre nombre, teléfono o legajo (sin acentos y case-insensitive)
export function includesContacto(contact, q) {
  const qn = norm(q)
  if (!qn) return true
  const fields = [contact.nombre, contact.telefono, contact.legajo].map(norm)
  return fields.some(f => f.includes(qn))
}
