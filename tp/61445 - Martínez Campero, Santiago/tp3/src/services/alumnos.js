import alumnosVcf from '../../public/alumnos.vcf?raw';

export function parseVcf(vcfText) {
  const alumnos = [];
  const lineas = vcfText.split('\n');
  let alumnoActual = null;
  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i].trim();
    
    if (linea === 'BEGIN:VCARD') {
      alumnoActual = {
        nombre: '',
        telefono: '',
        legajo: 0,
        github: '',
        favorito: false
      };
    }
    
    if (linea === 'END:VCARD' && alumnoActual) {
      if (alumnoActual.nombre) {
        alumnos.push(alumnoActual);
      }
      alumnoActual = null;
    }
    
    if (alumnoActual) {
      if (linea.startsWith('FN:')) {
        alumnoActual.nombre = linea.replace('FN:', '').trim();
      }
      
      if (linea.startsWith('TEL')) {
        const partes = linea.split(':');
        if (partes.length > 1) {
          alumnoActual.telefono = partes[1].trim();
        }
      }
      
      if (linea.startsWith('NOTE:')) {
        const note = linea.replace('NOTE:', '').trim();
        
        if (note.includes('Legajo:')) {
          const partes = note.split('Legajo:')[1];
          const numero = partes.split('-')[0].trim();
          alumnoActual.legajo = parseInt(numero);
        }
        
        if (note.includes('Github:')) {
          const partes = note.split('Github:')[1];
          alumnoActual.github = partes.trim();
        }
      }
    }
  }
  
  return alumnos;
}

export function loadAlumnos() {
  const alumnos = parseVcf(alumnosVcf);
  console.log(`Cargados ${alumnos.length} alumnos`);
  return alumnos;
}
