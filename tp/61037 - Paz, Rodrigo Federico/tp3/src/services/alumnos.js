// parseo simple de VCF asumiendo formato fijo (cada tarjeta tiene FN, TEL;TYPE=CELL y opcional NOTE)
export function parseVcf(raw) {
  // agarramos cada bloque BEGIN...END
  const cards = raw.match(/BEGIN:VCARD[\s\S]*?END:VCARD/g) || []
  const students = cards.map(card => {
    const fnMatch = card.match(/^FN:(.+)$/m)
    const telMatch = card.match(/TEL[^:]*:(.+)$/m)
    const noteMatch = card.match(/^NOTE:(.+)$/m)

    const nombre = fnMatch ? fnMatch[1].trim() : ''
    const telefono = telMatch ? telMatch[1].trim() : ''
    const note = noteMatch ? noteMatch[1].trim() : ''

    // extraer legajo y github desde NOTE si existen
    const legajoMatch = note.match(/Legajo:\s*(\d+)/i)
    const githubMatch = note.match(/Github:\s*([^\s,;]+)/i)

    const legajo = legajoMatch ? legajoMatch[1] : ''
    const github = githubMatch ? (githubMatch[1] === '' ? '' : githubMatch[1]) : ''

    return {
      id: legajo, // requisito: id = legajo
      nombre,
      telefono,
      legajo,
      github: github || '',
      favorito: false
    }
  })

  return students
}

// helper para cargar (aquí es síncrono)
export function loadAlumnos(raw) {
  return parseVcf(raw)
}