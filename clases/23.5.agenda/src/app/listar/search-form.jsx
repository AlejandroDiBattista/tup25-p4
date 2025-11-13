"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"

export function SearchForm({ initialQuery = "" }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(initialQuery)
  const [, startTransition] = useTransition()

  useEffect(() => {
    setValue(initialQuery)
  }, [initialQuery])

  const updateQueryParams = (nextValue) => {
    const params = new URLSearchParams(searchParams)

    if (nextValue) {
      params.set("q", nextValue)
    } else {
      params.delete("q")
    }

    const queryString = params.toString()
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname

    startTransition(() => {
      router.replace(nextUrl, { scroll: false })
    })
  }

  const handleChange = (event) => {
    const nextValue = event.target.value
    setValue(nextValue)
    updateQueryParams(nextValue)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4 items-center">
      <Input
        className="w-64"
        name="q"
        value={value}
        onChange={handleChange}
        placeholder="Buscar contactos..."
        aria-label="Buscar contactos"
        autoComplete="off"
      />
    </form>
  )
}
