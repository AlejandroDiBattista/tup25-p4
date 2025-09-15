// Importación del archivo VCF
import alumnosVcfUrl from '../alumnos.vcf?raw';

// Lee el contenido del archivo VCF
const alumnosVcf = alumnosVcfUrl;

// Parsea una cadena VCF y devuelve un array de objetos de alumno
export const parseVcf = (vcf) => {
  if (!vcf || typeof vcf !== 'string') {
    console.error('VCF inválido:', vcf);
    return [];
  }

  console.log('Contenido VCF recibido:', vcf.substring(0, 100) + '...');
  const cards = vcf.split('BEGIN:VCARD').slice(1);
  
  return cards.map(card => {
    console.log('Procesando tarjeta:', card);
    const getFN = card.match(/FN:(.+)/)?.[1] || '';
    const getTEL = card.match(/TEL;TYPE=CELL:(.+)/)?.[1] || '';
    const getNote = card.match(/NOTE:(.+)/)?.[1] || '';
    
    const legajo = getNote.match(/Legajo: (\d+)/)?.[1] || '';
    const github = getNote.match(/Github: ([^\s]+)/)?.[1] || '';

    const alumno = {
      id: legajo,
      nombre: getFN,
      telefono: getTEL,
      legajo,
      github,
      favorito: false
    };
    console.log('Alumno procesado:', alumno);
    return alumno;
  });
};

// Carga y parsea el archivo VCF
export const loadAlumnos = () => {
  return parseVcf(alumnosVcf);
};
