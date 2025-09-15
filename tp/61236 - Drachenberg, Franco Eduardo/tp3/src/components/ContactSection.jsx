import React from "react";
import ContactCard from "./ContactCard";

export default function ContactSection({ title, contacts = [] }) {
  return (
    <section>
      <h2>
        {title} ({contacts.length})
      </h2>
      <div>
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </section>
  );
}
