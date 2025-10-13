import React, { useMemo } from 'react'

export function ContactAvatar({ firstName = '', lastName = '' }) {
  const initials = useMemo(() => {
    const nameInitial = firstName.trim().charAt(0)
    const lastInitial = lastName.trim().charAt(0)
    return `${nameInitial}${lastInitial}`.toUpperCase() || '??'
  }, [firstName, lastName])

  return <div className="contact-avatar">{initials}</div>
}

export default ContactAvatar
