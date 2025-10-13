import ContactCard from './ContactCard'

export default function ContactSection({ title, contacts, onToggleFavorite }) {
  if (!contacts || contacts.length === 0) return null
  return (
    <section>
      {title && <h2>{title}<small> ({contacts.length})</small></h2>}
      <div className="grid">
        {contacts.map((c) => <ContactCard key={c.id} contact={c} onToggleFavorite={onToggleFavorite} />)}
      </div>
    </section>
  )
}
