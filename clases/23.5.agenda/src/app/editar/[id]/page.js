import React from "react"

async function getContacto(id) {
  const url = new URL(`/api/contactos/${id}`, 'http://localhost:3000').toString();
  const res = await fetch(url);
  return res.json();
}

export default async function EditarPage({ params }) {
  const id = parseInt(params.id, 10)
  const contacto = await getContacto(id)

  if (!contacto) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Contacto no encontrado</h1>
        <p>El contacto con ID {id} no existe.</p>
      </div>
    )
  }

  const EditForm = (await import("@/components/EditForm.jsx")).default

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Editar Contacto</h1>
      <EditForm contacto={contacto} />
    </div>
  )
}

