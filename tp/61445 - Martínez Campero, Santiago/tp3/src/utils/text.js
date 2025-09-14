export function norm(texto) {
  if (!texto) return '';
  
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita acentos
    .trim();
}

export function cmpNombre(a, b) {
  const nombreA = norm(a.nombre);
  const nombreB = norm(b.nombre);
  
  return nombreA.localeCompare(nombreB);
}

export function includesContacto(contacto, termino) {
  if (!termino) return true;
  
  const busqueda = norm(termino);
  const nombre = norm(contacto.nombre || '');
  const telefono = norm(contacto.telefono || '');
  const legajo = String(contacto.legajo || '');
  
  return nombre.includes(busqueda) || 
         telefono.includes(busqueda) || 
         legajo.includes(busqueda);
}


export function getIniciales(nombre) {
  if (!nombre) return '??';
  
  const palabras = nombre.split(' ');
  if (palabras.length >= 2) {
    return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase();
  }
  
  return nombre.slice(0, 2).toUpperCase();
}