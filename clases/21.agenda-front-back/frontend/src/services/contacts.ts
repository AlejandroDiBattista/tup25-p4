const API_BASE_URL = "http://localhost:8000/api";

export interface Phone {
  id: number;
  number: string;
}

export interface Contact {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  phones: Phone[];
}

export interface ContactCreate {
  nombre: string;
  apellido: string;
  email: string;
  phones: string[];
}

export interface ContactList {
  contacts: Contact[];
  total: number;
}

class ContactsAPI {

  async create(contact: ContactCreate): Promise<Contact> {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(contact),
    });
    if (!response.ok) { throw new Error("Error al crear el contacto"); }
    return response.json();
  }

  async readAll(search?: string): Promise<ContactList> {
    const url = new URL(`${API_BASE_URL}/contacts`);
    if (search) {
      url.searchParams.append("search", search);
    }

    const response = await fetch(url.toString());
    if (!response.ok) { throw new Error("Error al obtener contactos"); }
    return response.json();
  }

  async read(id: number): Promise<Contact> {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`);
    if (!response.ok) { throw new Error("Error al obtener el contacto"); }
    return response.json();
  }

  async update(id: number, contact: ContactCreate): Promise<Contact> {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(contact),
    });
    if (!response.ok) { throw new Error("Error al actualizar el contacto"); }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) { throw new Error("Error al eliminar el contacto"); }
  }
}

export const contactsAPI = new ContactsAPI();
