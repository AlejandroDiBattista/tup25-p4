import React from 'react';

export default function ContactCard({ contact }) {
  return (
    <article>
      <header>
        <strong>{contact.nombre}</strong>
      </header>
      <p>Tel: {contact.telefono}</p>
      <p>Legajo: {contact.legajo}</p>
    </article>
  );
}
