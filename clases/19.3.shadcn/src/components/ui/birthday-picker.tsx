"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

interface BirthdayPickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function BirthdayPicker({ 
  date, 
  onSelect, 
  placeholder = "15 de marzo de 1990",
  className 
}: BirthdayPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(
    date || new Date(1990, 0) // Empezar en 1990 si no hay fecha
  )
  const [value, setValue] = React.useState(formatDate(date))

  // Sincronizar el input con la prop date
  React.useEffect(() => {
    setValue(formatDate(date))
  }, [date])

  return (
    <div className="relative flex gap-2">
      <Input
        value={value}
        placeholder={placeholder}
        className="bg-background pr-10"
        onChange={(e) => {
          const inputDate = new Date(e.target.value)
          setValue(e.target.value)
          if (isValidDate(inputDate)) {
            setMonth(inputDate)
            onSelect?.(inputDate)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            type="button"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Seleccionar fecha</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(selectedDate) => {
              onSelect?.(selectedDate)
              setValue(formatDate(selectedDate))
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}