import { NextResponse } from "next/server"

import { buildExam } from "@/lib/exams"

const MIN_EXAM_NUMBER = 1

export async function GET(_request: Request, { params }: { params: Promise<{ nro: string }> }) {
  const { nro } = await params
  const examNumber = Number.parseInt(nro, 10)

  if (!Number.isInteger(examNumber) || examNumber < MIN_EXAM_NUMBER) {
    return NextResponse.json({ message: "Número de examen inválido" }, { status: 400 })
  }

  try {
    const exam = await buildExam(examNumber)

    return NextResponse.json(exam, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Error al construir el examen", error)
    return NextResponse.json({ message: "No se pudo generar el examen" }, { status: 500 })
  }
}
