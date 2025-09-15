import React from "react";

export default function ContactCard({ contact, onToggleFavorite }) {
  return (
    <article>
      <header>
        <strong>{contact.nombre}</strong>
        <button onClick={() => onToggleFavorite(contact.id)}>
          {contact.favorito ? "★" : "☆"}
        </button>
      </header>
      <p>Tel: {contact.telefono}</p>
      <p>Legajo: {contact.legajo}</p>
    </article>
  );
}
