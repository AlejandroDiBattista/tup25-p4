import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl"
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackName?: string
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10", 
      lg: "h-12 w-12",
      xl: "h-16 w-16"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-muted",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, fallbackName, onError, ...props }, ref) => {
    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (fallbackName) {
        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=6366f1&color=fff`
      }
      onError?.(e)
    }

    return (
      <img
        ref={ref}
        className={cn("aspect-square h-full w-full object-cover", className)}
        onError={handleError}
        {...props}
      />
    )
  }
)
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }