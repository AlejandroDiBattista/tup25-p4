import { Button } from "@/components/ui/button"

interface ButtonDestructiveProps {
  children?: React.ReactNode
}

export function ButtonDestructive({ children = "Destructive" }: ButtonDestructiveProps) {
  return <Button variant="destructive">{children}</Button>
}
