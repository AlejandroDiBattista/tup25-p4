import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './chat.css'
import { generateChat } from './gemini'

function Chat() {
  const [messages, setMessages] = useState(() => ([
    { role: 'model', text: 'Hola! Soy un bot con Gemini. ¿En qué te ayudo?' },
  ]))
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  // Scroll al final en cada mensaje nuevo
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const canSend = input.trim().length > 0 && !loading

  async function onSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    const next = [...messages, { role: 'user', text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      // Recorta historial a las últimas 8 intervenciones para ahorrar tokens
      const shortHistory = next.slice(-8)
      const reply = await generateChat(shortHistory)
      setMessages((prev) => [...prev, { role: 'model', text: reply }])
    } catch (err) {
      const msg = err?.message || String(err)
      setMessages((prev) => [...prev, { role: 'model', text: 'Error: ' + msg }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-wrap">
      <header className="chat-header">
        <h1>Chat Gemini <small>• demo básica</small></h1>
        <div className="tip">Definí VITE_GEMINI_API_KEY en .env (o guarda tu key en localStorage.gemini_key)</div>
      </header>

      <div className="messages" ref={listRef}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>{m.text}</div>
        ))}
        {loading && <div className="bubble model">Escribiendo…</div>}
      </div>

      <form className="composer" onSubmit={onSend}>
        <input
          type="text"
          placeholder="Escribe tu mensaje y presiona Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <button type="submit" disabled={!canSend}>Enviar</button>
      </form>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<Chat />)

