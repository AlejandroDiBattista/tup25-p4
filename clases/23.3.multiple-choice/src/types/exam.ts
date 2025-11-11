export type Question = {
  numero: number
  enunciado: string
  respuestas: string[]
  correcta: number
}

export type Exam = {
  examNumber: number
  questions: Question[]
}
