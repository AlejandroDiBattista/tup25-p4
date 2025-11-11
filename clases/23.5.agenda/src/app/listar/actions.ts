"use server"

import { contactos as data } from "@/lib/db"
import type { Contacto } from "@/types/contacto"

export async function buscarContactos(formData: FormData): Promise<Contacto[]> {
  const qRaw = formData.get("q")
  const q = (qRaw ? String(qRaw) : "").trim().toLowerCase()
  if (!q) return data
  return data.filter(c => {
    const full = `${c.nombre} ${c.apellido}`.toLowerCase()
    const fullRev = `${c.apellido} ${c.nombre}`.toLowerCase()
    return full.includes(q) || fullRev.includes(q) || String(c.telefono).includes(q) || String(c.id) === q
  })
}

// Server Action compatible con useActionState (firma: (prevState, formData))
export async function buscarContactosAction(prevState: any, formData: FormData) {
  'use server'
  const qRaw = formData.get('q')
  const q = (qRaw ? String(qRaw) : '').trim()
  const lower = q.toLowerCase()
  const results = lower
    ? data.filter(c => {
        const full = `${c.nombre} ${c.apellido}`.toLowerCase()
        const fullRev = `${c.apellido} ${c.nombre}`.toLowerCase()
        return full.includes(lower) || fullRev.includes(lower) || String(c.telefono).includes(lower) || String(c.id) === lower
      })
    : data
  return { q, results }
}
