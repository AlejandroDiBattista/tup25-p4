import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { ExamProvider } from "@/contexts/exam-context"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Generador de Exámenes",
  description: "Aplicación para responder exámenes múltiples choice",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ExamProvider>{children}</ExamProvider>
      </body>
    </html>
  )
}
