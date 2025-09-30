// Tipo para los contactos
export type Contact = {
  id: number
  nombre: string
  apellido: string
  telefono: string
  email: string
  empresa: string
  puesto: string
  avatar: string
}

// Datos de ejemplo de contactos
export const initialContactsData: Contact[] = [
  {
    id: 1,
    nombre: "Ana",
    apellido: "García",
    telefono: "+54 11 1234-5678",
    email: "ana.garcia@email.com",
    empresa: "Tech Solutions",
    puesto: "Desarrolladora Frontend",
    avatar: "https://github.com/defunkt.png"
  },
  {
    id: 2,
    nombre: "Carlos",
    apellido: "Rodríguez",
    telefono: "+54 11 2345-6789",
    email: "carlos.rodriguez@email.com",
    empresa: "Digital Marketing",
    puesto: "Especialista en SEO",
    avatar: "https://github.com/pjhyett.png"
  },
  {
    id: 3,
    nombre: "María",
    apellido: "López",
    telefono: "+54 11 3456-7890",
    email: "maria.lopez@email.com",
    empresa: "Design Studio",
    puesto: "Diseñadora UX/UI",
    avatar: "https://github.com/mojombo.png"
  },
  {
    id: 4,
    nombre: "Diego",
    apellido: "Martínez",
    telefono: "+54 11 4567-8901",
    email: "diego.martinez@email.com",
    empresa: "StartUp Inc",
    puesto: "Product Manager",
    avatar: "https://github.com/torvalds.png"
  },
  {
    id: 5,
    nombre: "Laura",
    apellido: "Fernández",
    telefono: "+54 11 5678-9012",
    email: "laura.fernandez@email.com",
    empresa: "Consulting Group",
    puesto: "Consultora Senior",
    avatar: "https://github.com/octocat.png"
  }
]