import { useEffect, useRef, useState } from 'react'

const isBrowser = typeof window !== 'undefined'

function readValue(key, initialValue) {
  if (!isBrowser) return typeof initialValue === 'function' ? initialValue() : initialValue

  try {
    const storedValue = window.localStorage.getItem(key)
    if (!storedValue) {
      return typeof initialValue === 'function' ? initialValue() : initialValue
    }
    return JSON.parse(storedValue)
  } catch (error) {
    console.warn(`No se pudo leer la clave ${key} desde localStorage`, error)
    return typeof initialValue === 'function' ? initialValue() : initialValue
  }
}

export function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => readValue(key, initialValue))
  const keyRef = useRef(key)
  const initialRef = useRef(initialValue)

  useEffect(() => {
    if (keyRef.current !== key) {
      keyRef.current = key
      setState(readValue(key, initialRef.current))
    }
  }, [key])

  useEffect(() => {
    if (!isBrowser) return

    try {
      window.localStorage.setItem(keyRef.current, JSON.stringify(state))
    } catch (error) {
      console.warn(`No se pudo persistir la clave ${keyRef.current} en localStorage`, error)
    }
  }, [state])

  useEffect(() => {
    if (!isBrowser) return

    function handleStorage(event) {
      if (event.key !== keyRef.current) return
      setState(event.newValue ? JSON.parse(event.newValue) : readValue(keyRef.current, initialRef.current))
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return [state, setState]
}
