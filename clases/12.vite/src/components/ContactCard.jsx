import { Star } from 'lucide-react'

export default function ContactCard({ contact: c, onToggleFavorite }) {
  const initials = (c.nombre || '')
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s.charAt(0))
    .join('')
  const avatarUrl = c.github ? `https://github.com/${c.github}.png?size=100` : ''

  return (
    <article className="card">
      <button
        className={`icon-btn fav-btn ${c.favorito ? 'fav' : ''}`}
        title={c.favorito ? 'Quitar de favoritos' : 'Marcar como favorito'}
        onClick={() => onToggleFavorite?.(c.id)}
      >
        <Star size={20} strokeWidth={2} {...(c.favorito ? { fill: 'currentColor' } : {})} />
      </button>
      <div className="title-row">
        <div className="avatar">{avatarUrl ? <img src={avatarUrl} alt="" className="avatar-img" /> : initials}</div>
        <h3 className="name">{c.nombre}</h3>
      </div>
      <ul className="info">
        <li><strong>Tel:</strong> {c.telefono}</li>
        <li><strong>Legajo:</strong> {c.legajo}</li>
      </ul>
    </article>
  )
}
