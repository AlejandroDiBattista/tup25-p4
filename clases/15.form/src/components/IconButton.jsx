import React from 'react'

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  className = '',
  type = 'button',
  ...props
}) {
  const classes = ['icon-button', variant, className].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  )
}

export default IconButton
