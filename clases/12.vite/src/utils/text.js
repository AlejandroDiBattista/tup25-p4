export function norm(s = '') {
  try {
    return String(s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  } catch {
    return String(s).toLowerCase()
  }
}

export function cmpNombre(a, b) {
  return norm(a.nombre).localeCompare(norm(b.nombre))
}

export function includesContacto(contacto, term) {
  const texto = `${contacto.nombre} ${contacto.telefono} ${contacto.legajo}`
  return norm(texto).includes(norm(term))
}

