import React from "react";

const Avatar = ({ contact }) => {
  if (contact.github) {
    return (
      <img
        className="avatar"
        src={`https://github.com/${contact.github}.png?size=100`}
        alt={`Avatar de ${contact.nombre}`}
      />
    );
  }

  const initials = contact.nombre
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2);

  return <div className="avatar avatar-placeholder">{initials}</div>;
};

export default function ContactCard({ contact, onToggleFavorite }) {
  return (
    <article className="contact-card">
      <Avatar contact={contact} />
      <div className="contact-details">
        <header>
          <strong>{contact.nombre}</strong>
          <button
            className="favorite-btn"
            onClick={() => onToggleFavorite(contact.id)}
          >
            {contact.favorito ? "★" : "☆"}
          </button>
        </header>
        <p>Tel: {contact.telefono}</p>
        <p>Legajo: {contact.legajo}</p>
      </div>
    </article>
  );
}
