import React from 'react'

const baseProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function PlusIcon({ size = 20, strokeWidth = 1.6 }) {
  return (
    <svg {...baseProps} width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export function EditIcon({ size = 20, strokeWidth = 1.6 }) {
  return (
    <svg {...baseProps} width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
      <path d="M12.17 5.67 15.94 9.44" />
      <path d="M4 21h4l11.29-11.29a1 1 0 0 0 0-1.42l-3.58-3.58a1 1 0 0 0-1.42 0L4 16.59V21z" />
    </svg>
  )
}

export function EraserIcon({ size = 20, strokeWidth = 1.6 }) {
  return (
    <svg {...baseProps} width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
      <path d="M3 16.5 12.5 7a2 2 0 0 1 2.83 0l5.67 5.67a1.5 1.5 0 0 1 0 2.12l-5.31 5.31a2 2 0 0 1-1.42.59H7.41a2 2 0 0 1-1.41-.59L3 18.5a1.41 1.41 0 0 1 0-2z" />
      <path d="M9 21h4.5" />
    </svg>
  )
}

export function CheckIcon({ size = 20, strokeWidth = 1.6 }) {
  return (
    <svg {...baseProps} width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

export function CloseIcon({ size = 20, strokeWidth = 1.6 }) {
  return (
    <svg {...baseProps} width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
      <path d="m7 7 10 10" />
      <path d="M17 7 7 17" />
    </svg>
  )
}

export function PersonIcon({ size = 24, strokeWidth = 1.4 }) {
  return (
    <svg {...baseProps} width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </svg>
  )
}
