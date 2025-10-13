import alumnosVcf from '../../alumnos.vcf?raw'

// Parser simplificado con expresiones regulares asumiendo un patrón fijo
export function parseVcf(texto) {
  const cards = []
  const reCard = /BEGIN:VCARD[\s\S]*?END:VCARD/g
  const blocks = texto.match(reCard) || []

  for (const block of blocks) {
    const nombre   = (block.match(/\n?FN:([^\r\n]+)/) || [, ''])[1].trim()
    const telefono = (block.match(/\n?TEL[^:]*:([^\r\n]+)/) || [, ''])[1].trim()
    const legajo   = (block.match(/NOTE:.*?Legajo:\s*(\d+)/i) || [, ''])[1].trim()
    const github   = (block.match(/Github:\s*([^\s\r\n]+)/i) || [, ''])[1].trim()
    if (!nombre && !telefono) continue
    const id = legajo || `${nombre}-${telefono}`
    cards.push({ id, nombre, telefono, legajo, github, favorito: false })
  }

  return cards
}

export function loadAlumnos() {
  return parseVcf(alumnosVcf)
}
